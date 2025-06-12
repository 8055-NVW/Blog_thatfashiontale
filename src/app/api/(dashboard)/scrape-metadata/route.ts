import { NextResponse } from "next/server";
import ogs from "open-graph-scraper"

export const POST = async (request: Request) => {
    try {
        const { url } = await request.json();
        const { error, result } = await ogs({ url });
        const options = { url: 'https://www.airbnb.co.uk/rooms/983083466639793524?check_in=2025-06-13&check_out=2025-06-15&photo_id=1887595503&source_impression_id=p3_1749728904_P3QQjrlzO2MEwVap&previous_page_section_name=1000' };
        ogs(options)
            .then((data) => {
                const { error, html, result, response } = data;
                // console.log('error:', error);  // This returns true or false. True if there was an error. The error itself is inside the result object.
                // console.log('html:', html); // This contains the HTML of page
                console.log('result:', result); // This contains all of the Open Graph results
                // console.log('response:', response); // This contains response from the Fetch API
            })

        if (!url) {
            return new NextResponse("Missing URL", { status: 400 });
        }

        if (error) throw new Error("Failed to scrape");

        const item = {
            title: result.ogTitle || "Untitled",
            image: result.twitterImage || "",
            link: url,
        };

        return NextResponse.json(item);

    } catch (error: any) {
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}