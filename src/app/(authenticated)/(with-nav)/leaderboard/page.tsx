import { User, users } from "@/lib/dummy";
import Image from "next/image";


export default function Page() {
    return (
        <div className="p-mobile">
            <h2 className="header2 text-center !mb-6">Leaderboard</h2>
            <div className="border-3 border-black bg-white rounded-xl p-6">
                <div className="flex flex-row flex-nowrap items-center mb-6">
                    <Image
                    className="mr-3"
                        width={50}
                        height={50}
                        src="https://ucarecdn.com/c5547281-e8c9-4dc7-863d-890265f23786/-/preview/139x164/"
                        alt="duckling"
                    />
                    <div>
                        <p className="font-bold">Level 1</p>
                        <p className="text-sm">Duckling</p>
                    </div>
                    <div className="ml-auto w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-black">
                    </div>
                </div>
                <div>
                    <div className="w-full h-1.5 bg-gray-200"></div>
                    <div className="text-xxs">
                        <span>0/200XP</span><span className="float-right">0%</span>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {users.map((u, index) => {
                    return <LeaderboardItem key={u.id} user={u} number={index + 1} />
                })}
            </div>
        </div>
    );
}

function LeaderboardItem({ number, user }: { number: number; user: User; }) {
    return <div className="border-b border-white py-2 gap-2 text-white text-sm flex flex-row flex-nowrap items-center">
        <span>{number}.</span>
        <Image
            className="rounded-full aspect-square object-cover h-auto border-1 border-white"
            src={user.avatar}
            width={45}
            height={45}
            alt=""

        />
        <span>{user.name}</span>
        <span className="ml-auto">{user.xp}XP</span>
    </div>
}