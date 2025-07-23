/* eslint-disable jsx-a11y/useAltText */
/* eslint-disable react-hooks/exhaustive-deps */
{/* biome-ignore a11y/useAltText: Image has appropriate alt text */ }
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import classNames from "classnames";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface ReadImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
    src: string;
    alt?: string;
    loadingClassName?: string;
    containerClassName?: string;
    onVisible?: () => void;
}

const ReadImage: React.FC<ReadImageProps> = ({
    src,
    alt,
    className,
    loadingClassName,
    containerClassName,
    onLoad,
    onVisible,
    ...props
}) => {
    const [loaded, setLoaded] = useState(false);
    const ref = useRef<HTMLImageElement>(null);

    const entry = useIntersectionObserver(ref as React.RefObject<Element>, {
        rootMargin: "0px 0px 10px 0px",
    });

    // Reset loaded state when src changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    /* eslint-disable jsx-a11y/useAltText */
    /* eslint-disable react-hooks/exhaustive-deps */
    {/* biome-ignore a11y/useAltText: Image has appropriate alt text */ }
    useEffect(() => {
        setLoaded(false);
    }, [src]);

    // Callback when image is visible in viewport
    useEffect(() => {
        if (!entry?.isIntersecting) return;
        if (!ref.current) return;
        if (!ref.current.complete) return;
        onVisible?.();
    }, [entry?.isIntersecting, onVisible]);

    return (
        <>
            {!loaded && (
                <div
                    className={classNames(
                        "flex h-60 w-full flex-col items-center justify-center gap-2 text-gray-500",
                        loadingClassName
                    )}
                >
                    <img className="w-12 animate-pulse" src="/images/nazuna1.gif" alt="nazuna1" />
                    <p>Đợi chút nhé...</p>
                </div>
            )}

            <motion.div
                animate={loaded ? "animate" : "initial"}
                initial="initial"
                exit="exit"
                variants={{
                    animate: { opacity: 1, display: "block" },
                    initial: { opacity: 0, display: "none" },
                }}
                className={containerClassName}
            >
                {/* biome-ignore a11y/useAltText: Image has appropriate alt text */}
                <img
                    ref={ref}
                    src={src}
                    alt={alt !== undefined ? alt : "Đọc truyện tại nazuna"}
                    onLoad={e => {
                        setLoaded(true);
                        onLoad?.(e);
                    }}
                    onError={() => setLoaded(true)}
                    className={className}
                    {...props}
                />

            </motion.div>
        </>
    );
};

export default React.memo(ReadImage);
