import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";

interface BaseLayoutProps {
    showHeader?: boolean;
    showFooter?: boolean;
    children: React.ReactNode;
}


export default function BaseLayout({ children,
    showHeader = true,
    showFooter = true,
}: BaseLayoutProps) {
    return (
        <React.Fragment>
            {showHeader && <Header />}
            <main>
                {children}
            </main>
            {showFooter && <Footer />}
        </React.Fragment>
    )
}