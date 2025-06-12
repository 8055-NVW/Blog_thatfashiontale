import { NextResponse } from "next/server";
import ogs from "open-graph-scraper"

export const POST = async (request: Request) => {
    try {
        const { url } = await request.json();
        if (!url) return new NextResponse("Missing URL", { status: 400 });

        const { error, result } = await ogs({ url });
        if (error) throw new Error("Failed to scrape");

        const ogImage = Array.isArray(result.ogImage) ? result.ogImage[0]?.url : result.ogImage?.url;
        const twitterImage = Array.isArray(result.twitterImage)
            ? result.twitterImage[0]?.url
            : result.twitterImage?.url;
        
            const item = {
            title: result.ogTitle || result.twitterTitle || "Untitled",
            image: ogImage || twitterImage || "",
            link: url,
        };

        return NextResponse.json(item);

    } catch (error: any) {
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}