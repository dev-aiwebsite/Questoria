"use client";

import LogoWithClouds from "@/components/logoWithClouds";
import PrivacyPolicyPopup from "@/components/popups/privacyPolicyPopup";
import TermsOfUsePopup from "@/components/popups/termsOfUsePopup";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);

    const [nextStep, setNextStep] = useState<"privacy" | "terms" | null>(null);

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        // if both already agreed -> proceed
        if (agreePrivacy && agreeTerms) {
            console.log("Proceed with registration");
            return;
        }

        // if privacy not agreed -> show privacy first
        if (!agreePrivacy) {
            setNextStep("privacy");
            setIsPrivacyOpen(true);
            return;
        }

        // if privacy agreed but terms not -> show terms
        if (agreePrivacy && !agreeTerms) {
            setNextStep("terms");
            setIsTermsOpen(true);
            return;
        }
    }

    return (
        <>
            <PrivacyPolicyPopup
                isTriggerHidden={true}
                open={isPrivacyOpen}
                closeText={
                    <>
                        <input type="checkbox" />
                        I have read and accept the Privacy Policy
                    </>
                }

                onClose={() => {
                    setIsPrivacyOpen(false);
                    setAgreePrivacy(true);

                    // after privacy is closed, show terms next
                    if (nextStep === "privacy") {
                        setNextStep("terms");
                        setIsTermsOpen(true);
                    }
                }}
            />

            <TermsOfUsePopup
                isTriggerHidden={true}
                open={isTermsOpen}
                closeText={
                    <>
                        <input type="checkbox" />
                        I have read and accept the Terms of Use
                    </>
                }
                onClose={() => {
                    setIsTermsOpen(false);
                    setAgreeTerms(true);

                    // if both are now agreed -> proceed
                    if (agreePrivacy && nextStep === "terms") {
                        console.log("Proceed with registration");
                    }
                }}
            />

            <div className="relative isolate flex flex-col bg-primary h-screen overflow-hidden">
                <div className="absolute top-0 mt-10 -z-2">
                    <LogoWithClouds />
                </div>

                <div className="mt-auto mb-10 space-y-4 mx-auto w-[380px] max-w-[95vw]">
                    <h2 className="header2 !mb-6">Enter Your Details</h2>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <input className="flex-1" type="text" name="reg_fname" placeholder="Firstname" />
                        <input className="flex-1" type="text" name="reg_lname" placeholder="Lastname" />
                    </div>

                    <input className="w-full" type="text" name="reg_username" placeholder="Username" />
                    <input className="w-full" type="email" name="reg_email" placeholder="Email" />
                    <input className="w-full" type="password" placeholder="Password" />
                    <input className="w-full" type="password" placeholder="Confirm Password" />

                    <button
                        onClick={(e) => handleSubmit(e)}
                        className="text-xl btn primary font-bold w-full mt-4"
                    >
                        Register
                    </button>

                    <div className="justify-center text-center flex gap-4 flex-row font-bold">
                        <Link className="underline flex-1" href="/login">
                            Already have an account?
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
