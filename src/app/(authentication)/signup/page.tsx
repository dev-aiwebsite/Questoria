"use client";

import { useAppRouter } from "@/app/contexts/appRouter";
import LogoWithClouds from "@/components/logoWithClouds";
import PrivacyPolicyPopup from "@/components/popups/privacyPolicyPopup";
import TermsOfUsePopup from "@/components/popups/termsOfUsePopup";
import { createUser } from "@/server-actions/crudUser";
import { LoginUser } from "@/server-actions/loginLogout";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useAppRouter()
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);

    const [nextStep, setNextStep] = useState<"privacy" | "terms" | null>(null);

    // Form state
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit() {

        // Basic validation
        if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

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

    useEffect(() => {
        if (agreePrivacy && agreeTerms) {
            console.log("Proceed with registration");

            const formData = {
                firstname,
                lastname,
                username,
                email,
                password,
                avatar: "",
                gems: 0,
                xp: 0,
                onboarding: false
            };

         
            async function register() {
                setIsLoading(true)
                const res = await createUser(formData);
                if (res.success && res.data) {
                    setIsSuccess(true)

                     const authRes = await LoginUser({
                        email: res.data.email,
                        pass: res.data.password,
                    }, false)

               
                router.push(authRes?.redirectUrl)
                 setIsSuccess(true)
                setIsLoading(false)


                }
            }
            register()

        }
    }, [agreeTerms, agreePrivacy])
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

                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }} className="mt-auto mb-10 space-y-4 mx-auto w-[380px] max-w-[95vw]">
                        <h2 className="header2 !mb-6">Enter Your Details</h2>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <input
                                className="flex-1"
                                type="text"
                                name="reg_firstname"
                                placeholder="Firstname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                            />
                            <input
                                className="flex-1"
                                type="text"
                                name="reg_lastname"
                                placeholder="Lastname"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                            />
                        </div>

                        <input
                            className="w-full"
                            type="text"
                            name="reg_username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            className="w-full"
                            type="email"
                            name="reg_email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className="w-full"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            className="w-full"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                          <button
                        type="submit"
                        className="btn primary font-bold w-full !flex flex-row items-center justify-center gap-2"
                        disabled={isLoading}
                    >{isSuccess ? "ENTERING GAME..." : <>
                        {isLoading && <LoaderCircle className="animate-spin" />}
                        REGISTER</>}
                    </button>

                        <div className="justify-center text-center flex gap-4 flex-row font-bold">
                            <Link className="underline flex-1" href="/login">
                                Already have an account?
                            </Link>
                        </div>
                    </form>
                </div>
        </>
    );
}
