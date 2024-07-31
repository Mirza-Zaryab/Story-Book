import { useState } from "react";
import SideBarNav from "../../components/SideBarNav";

export default function Announcements() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className="h-full flex">
                <SideBarNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div>
                    Announcements
                </div>
            </div>
        </>
    )
}