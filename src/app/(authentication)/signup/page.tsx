import LogoWithClouds from "@/components/logoWithClouds";
import Link from "next/link";

export default function Page() {
    return (
        <div className="relative isolate flex flex-col bg-primary h-screen overflow-hidden">
            <div className="absolute top-0 mt-10 -z-2">
                <LogoWithClouds />
            </div>
            <div className="mt-auto mb-10 space-y-4 mx-auto w-[380px] max-w-[95vw] space-y-4">
                <h2 className="header2 !mb-6">Enter Your Details</h2>
                <div className="grid grid-cols-2 gap-4 w-full">
                    <input className="flex-1" type="text" name="reg_fname" placeholder="Firstname" />
                    <input className="flex-1" type="text" name="reg_lname" placeholder="Lastname" />
                </div>
                <input className="w-full" type="text" name="reg_username" placeholder="Username" />
                <input className="w-full" type="email" name="reg_email" placeholder="Email" />
                <input className="w-full" type="password" placeholder="Password" />
                <input className="w-full" type="password" placeholder="Confirm Password" />

                <button className="text-xl btn primary font-bold w-full">
                    Register
                </button>


                <div className="justify-center text-center flex gap-4 flex-row font-bold">
                    <Link
                        className="underline flex-1"
                        href="/login">
                        Already have an account?
                    </Link>
                </div>
            </div>
        </div>
    );
}