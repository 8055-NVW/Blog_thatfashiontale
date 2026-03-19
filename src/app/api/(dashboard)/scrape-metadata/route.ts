import { auth } from "@/auth";
import { NextResponse } from "next/server";
import ogs from "open-graph-scraper"

type MetadataRequestBody = {
    url?: string;
};

type ImageCandidate = {
    url?: string;
};

function formatPrice(amount?: string, currency?: string) {
    const trimmedAmount = amount?.trim();

    if (!trimmedAmount) {
        return undefined;
    }

    const trimmedCurrency = currency?.trim();

    if (!trimmedCurrency) {
        return trimmedAmount;
    }

    return `${trimmedCurrency} ${trimmedAmount}`;
}

function getImageUrl(value: unknown): string | undefined {
    if (Array.isArray(value)) {
        const first = value[0];

        if (first && typeof first === "object" && "url" in first && typeof first.url === "string") {
            return first.url;
        }

        return undefined;
    }

    if (value && typeof value === "object" && "url" in value && typeof value.url === "string") {
        return value.url;
    }

    return undefined;
}

export const POST = async (request: Request) => {
    try {
        const session = await auth();

        if (!session?.user?.id || !session.user.is_superuser) {
            return NextResponse.json({ message: "Admin authorization is required to scrape product metadata." }, { status: 403 });
        }

        const { url } = await request.json() as MetadataRequestBody;
        if (!url) return NextResponse.json({ message: "Missing URL" }, { status: 400 });

        const { error, result } = await ogs({ url });
        if (error) throw new Error("Failed to scrape");

        const ogImage = getImageUrl(result.ogImage as ImageCandidate | ImageCandidate[] | undefined);
        const twitterImage = getImageUrl(result.twitterImage as ImageCandidate | ImageCandidate[] | undefined);
        
        const price = formatPrice(
            result.ogProductPriceAmount || result.ogPriceAmount,
            result.ogProductPriceCurrency || result.ogPriceCurrency
        );

        const item = {
            title: result.ogTitle || result.twitterTitle || "Untitled",
            image: ogImage || twitterImage || "",
            link: url,
            price,
        };

        return NextResponse.json(item);

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message: `Error: ${message}` }, { status: 500 });
    }
}
