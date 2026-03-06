"use client";

import { useEffect } from "react";

type AdBannerProps = {
    dataAdSlot: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: boolean;
    style?: React.CSSProperties;
};

export default function AdBanner({
    dataAdSlot,
    dataAdFormat = "auto",
    dataFullWidthResponsive = true,
    style
}: AdBannerProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error("AdSense error", error);
        }
    }, [dataAdSlot]);

    return (
        <div style={{ width: "100%", overflow: "hidden", ...style }}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-7588181680111209"
                data-ad-slot={dataAdSlot}
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive.toString()}
            />
        </div>
    );
}
