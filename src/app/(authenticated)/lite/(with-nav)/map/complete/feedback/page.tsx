"use client";

import { Link } from "@/contexts/appRouter";
import { useCurrentUserContext } from "@/contexts/currentUserContext";
import { createFeedback } from "@/server-actions/crudFeedback";
import { Star } from "lucide-react";
import Image from "next/image";

import { useState } from "react";
// Import the server action created in step 2


export default function Page() {
  const [isSuccess, setIsSuccess] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {currentUser} = useCurrentUserContext()
  
  // Form State
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFormSubmit() {
    setErrorMsg("");
    if(!currentUser) return
    
    // Basic validation
    if (rating === 0) {
      setErrorMsg("Please select a star rating.");
      return;
    }

    setIsLoading(true);

    try {
      // Call server action
      const result = await createFeedback({
        user_id: currentUser.id,
        rating: rating,
        message: message
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(result.message);
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-mobile bg-primary height-with-nav overflow-auto">
      {isSuccess ? (
        <ThankYouPage />
      ) : (
        <div className="gap-4 text-center flex flex-col flex-nowrap justify-center h-full min-h-fit">
          <h1 className="header1 text-center mb-6">Questoria Feedback Form</h1>
          <p>Overall, how would you rate your adventure experience? </p>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
            className="space-y-10"
          >
            {/* Star Rating Section */}
            <div className="flex flex-row flex-nowrap items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <button
                  key={starIndex}
                  type="button" // Important to prevent form submit
                  onClick={() => setRating(starIndex)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-[50px] stroke-black w-auto aspect-square transition-colors duration-200 ${
                      starIndex <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400 fill-transparent"
                    }`}
                    size={24}
                  />
                </button>
              ))}
            </div>

            <p>Any feedback you’d like to share to the Questoria team?</p>
            
            <textarea
              className="w-full bg-white input p-3 border rounded-md"
              name="feedback-message"
              placeholder="Enter your message here..."
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Error Message Display */}
            {errorMsg && (
                <p className="text-red-500 font-bold">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function ThankYouPage() {
  return (
    <>
      <div className="p-mobile bg-primary height-with-nav overflow-auto">
        <div className="gap-4 text-center flex flex-col flex-nowrap justify-center h-full min-h-fit">
          <h1 className="header1 text-center mb-6">
            Thank you for your Feedback{" "}
          </h1>
          <Image
            className="mx-auto"
            src="/images/mascot-byebye.png"
            width={200}
            height={200}
            alt="Mascot waving goodbye"
          />
          <p>Follow us on social media</p>
          <div className="flex flex-row flex-nowrap gap-3 items-center justify-center">
            <div className="w-14 h-14 social linkedin"></div>
            <div className="w-14 h-14 social fb"></div>
            <div className="w-14 h-14 social insta"></div>
            <div className="w-14 h-14 social tiktok"></div>
          </div>
          <Link
          href="/lite/map" className="!mt-10 w-full btn primary block py-3">
            Return to Map
          </Link>
        </div>
      </div>
    </>
  );
}