"use client"

import { IconLogo } from "@/lib/icons/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shadcn/ui/dropdown-menu";
import TermsAndConditionPopup from "./popups/termsOfUsePopup";
import PrivacyPolicyPopup from "./popups/privacyPolicyPopup";
import { ReactNode, useState } from "react";
import { X } from "lucide-react";

export default function MobileLogoDropdown({align = 'start', trigger }: { trigger?: ReactNode; align?: "center" | "start" | "end" | undefined }) {
    const [isTermsOpen, setIsTermsOpen] = useState(false)
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)

    return (
        <>
            <PrivacyPolicyPopup closeClassName="sticky bottom-0 left-full text-white !bg-black/50 !hover:bg-gray-400/90 aspect-square !rounded-full !border-none" closeText={<X />} isTriggerHidden={true} open={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
            <TermsAndConditionPopup closeClassName="sticky bottom-0 left-full text-white !bg-black/50 !hover:bg-gray-400/90 aspect-square !rounded-full !border-none" closeText={<X />} isTriggerHidden={true} open={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {trigger ?? (
                        <IconLogo className="stroke-primary w-auto h-[50px]" />
                    )}

                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align={align}
                    className="bg-white rounded-xl font-medium p-2 text-md">
                    <DropdownMenuItem
                        onClick={() => setIsPrivacyOpen(true)}>
                        Privacy Policy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsTermsOpen(true)}>
                        Terms of use
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
