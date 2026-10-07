const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const TARGET = "https://lagoslife.app/";
const OUT = path.resolve(__dirname, "lagoslife_snapshot");

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, "screenshots"), { recursive: true });

const resources = [];

function safeName(url) {
    try {
        const u = new URL(url);
        let pathname = decodeURIComponent(u.pathname);

        if (!pathname || pathname === "/") {
            pathname = "/index.html";
        }

        pathname = pathname.replace(/^\/+/, "");
        pathname = pathname.replace(/[<>:"|?*]/g, "_");

        if (pathname.endsWith("/")) {
            pathname += "index.html";
        }

        if (pathname.length > 180) {
            const hash = crypto
                .createHash("sha1")
                .update(url)
                .digest("hex")
                .slice(0, 12);

            const ext = path.extname(pathname);
            pathname = pathname.slice(0, 160) + "_" + hash + ext;
        }

        return pathname;
    } catch {
        return "unknown_" +
            crypto
                .createHash("sha1")
                .update(url)
                .digest("hex")
                .slice(0, 12);
    }
}

(async () => {
    console.log("==========================================");
    console.log("LAGOS LIFE BROWSER CAPTURE");
    console.log("==========================================");
    console.log("");

    console.log("Launching installed Microsoft Edge...");

    const browser = await chromium.launch({
        headless: true,
        channel: "msedge"
    });

    const context = await browser.newContext({
        viewport: {
            width: 1440,
            height: 1000
        },
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/154.0.0.0 Safari/537.36"
    });

    const page = await context.newPage();

    page.on("request", request => {
        resources.push({
            event: "request",
            url: request.url(),
            method: request.method(),
            resourceType: request.resourceType()
        });
    });

    page.on("response", async response => {
        const request = response.request();

        resources.push({
            event: "response",
            url: response.url(),
            status: response.status(),
            resourceType: request.resourceType(),
            contentType:
                response.headers()["content-type"] || ""
        });
    });

    console.log("Opening:");
    console.log(TARGET);
    console.log("");

    await page.goto(TARGET, {
        waitUntil: "domcontentloaded",
        timeout: 60000
    });

    console.log("DOM loaded.");
    console.log("Waiting for JavaScript application to initialize...");
    console.log("");

    await page.waitForTimeout(15000);

    console.log("Saving rendered HTML...");

    const html = await page.content();

    fs.writeFileSync(
        path.join(OUT, "rendered.html"),
        html,
        "utf8"
    );

    console.log("Saving visible text...");

    const visibleText = await page.locator("body")
        .innerText()
        .catch(() => "");

    fs.writeFileSync(
        path.join(OUT, "visible-text.txt"),
        visibleText,
        "utf8"
    );

    console.log("Saving desktop screenshot...");

    await page.screenshot({
        path: path.join(
            OUT,
            "screenshots",
            "desktop.png"
        ),
        fullPage: true
    });

    console.log("Saving mobile screenshot...");

    await page.setViewportSize({
        width: 390,
        height: 844
    });

    await page.waitForTimeout(2000);

    await page.screenshot({
        path: path.join(
            OUT,
            "screenshots",
            "mobile.png"
        ),
        fullPage: true
    });

    await page.setViewportSize({
        width: 1440,
        height: 1000
    });

    console.log("Extracting page information...");

    const pageInfo = await page.evaluate(() => ({
        title: document.title,
        htmlLang: document.documentElement.lang,

        scripts: Array.from(
            document.scripts
        ).map(script => ({
            src: script.src,
            type: script.type,
            module: script.type === "module"
        })),

        stylesheets: Array.from(
            document.querySelectorAll(
                'link[rel="stylesheet"]'
            )
        ).map(link => link.href),

        links: Array.from(
            document.querySelectorAll("link")
        ).map(link => ({
            rel: link.rel,
            href: link.href,
            type: link.type
        })),

        meta: Array.from(
            document.querySelectorAll("meta")
        ).map(meta => ({
            name: meta.name,
            property:
                meta.getAttribute("property"),
            content: meta.content
        }))
    }));

    fs.writeFileSync(
        path.join(OUT, "page-info.json"),
        JSON.stringify(pageInfo, null, 2),
        "utf8"
    );

    console.log("Saving network inventory...");

    fs.writeFileSync(
        path.join(OUT, "network.json"),
        JSON.stringify(resources, null, 2),
        "utf8"
    );

    console.log("Checking browser storage...");

    const storage = await page.evaluate(() => ({
        localStorage:
            Object.keys(localStorage),

        sessionStorage:
            Object.keys(sessionStorage),

        cookies:
            document.cookie
                ? document.cookie
                    .split(";")
                    .map(x =>
                        x.trim().split("=")[0]
                    )
                : []
    }));

    fs.writeFileSync(
        path.join(OUT, "browser-storage.json"),
        JSON.stringify(storage, null, 2),
        "utf8"
    );

    console.log("Checking framework fingerprints...");

    const fingerprints = await page.evaluate(() => {
        const html =
            document.documentElement.outerHTML;

        return {
            reactRoot:
                !!document.querySelector(
                    '[data-reactroot], #root'
                ),

            nextData:
                !!document.querySelector(
                    "#__NEXT_DATA__"
                ),

            vue:
                !!document.querySelector(
                    "[data-v-app]"
                ) ||
                html.includes("__vue"),

            svelte:
                html.includes("svelte"),

            angular:
                html.includes("ng-version"),

            flutter:
                html.includes("flt-glass-pane") ||
                html.includes("flutter-view") ||
                html.includes("flt-scene"),

            vite:
                html.includes("@vite") ||
                html.includes("/@vite/"),

            webpack:
                html.includes("webpack")
        };
    });

    fs.writeFileSync(
        path.join(
            OUT,
            "framework-fingerprints.json"
        ),
        JSON.stringify(
            fingerprints,
            null,
            2
        ),
        "utf8"
    );

    await browser.close();

    console.log("");
    console.log("==========================================");
    console.log("LAGOS LIFE CAPTURE COMPLETE");
    console.log("==========================================");
    console.log("");
    console.log("Output folder:");
    console.log(OUT);
    console.log("");
    console.log("Created:");
    console.log("  rendered.html");
    console.log("  visible-text.txt");
    console.log("  page-info.json");
    console.log("  network.json");
    console.log("  browser-storage.json");
    console.log("  framework-fingerprints.json");
    console.log("  screenshots\\desktop.png");
    console.log("  screenshots\\mobile.png");
    console.log("");

    const result =
        "SUCCESS: Lagos Life browser capture completed.\n" +
        "Output: " + OUT;

    try {
        require("child_process")
            .execFileSync(
                "powershell.exe",
                [
                    "-NoProfile",
                    "-Command",
                    `Set-Clipboard -Value '${result.replace(/'/g, "''")}'`
                ],
                { stdio: "ignore" }
            );
    } catch {}
})();
