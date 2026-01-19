"use client"

import { IconLogo } from "@/lib/icons/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shadcn/ui/dropdown-menu";
import TermsAndConditionPopup from "./popups/termsOfUsePopup";
import PrivacyPolicyPopup from "./popups/privacyPolicyPopup";
import { useState } from "react";

export default function MobileLogoDropdown() {
    const [isTermsOpen, setIsTermsOpen] = useState(false)
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)

    return (
        <>
        <PrivacyPolicyPopup isTriggerHidden={true} open={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)}/>
        <TermsAndConditionPopup isTriggerHidden={true} open={isTermsOpen} onClose={() => setIsTermsOpen(false)}/>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <IconLogo className="stroke-primary w-auto h-[50px]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                align="start"
                className="bg-white rounded-xl font-medium p-2 text-md">
                    <DropdownMenuItem
                    onClick={()=>setIsPrivacyOpen(true)}>
                        Privacy Policy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    onClick={()=>setIsTermsOpen(true)}>
                        Terms of use
                    </DropdownMenuItem>
                    <DropdownMenuItem>About</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
