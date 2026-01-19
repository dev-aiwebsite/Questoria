"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";


type PopupProps= {
  triggerClassName?:string;
  closeText?: ReactNode;
  triggerText?: ReactNode;
  open?: boolean;
  onClose?: (v:boolean) => void;
  isTriggerHidden?: boolean
}
export default function TermsOfUsePopup({closeText = 'I have read and fully understand.', isTriggerHidden, onClose, open =false, triggerClassName, triggerText = "Privacy Policy" }:PopupProps) {

  return (
    <>
      {/* Trigger Button - label it anything */}
      {!isTriggerHidden && <button
         onClick={() => onClose?.(true)}
        className={triggerClassName}
      >{triggerText}
      </button>}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-99999999"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white border-3 border-black rounded-2xl p-6 w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >

              {/* Your Content */}
              <div className="text-sm font-medium">
                <h3 className="text-center header3 !mb-6">Terms and Conditions</h3>
                <ol className="list-decimal ml-5 space-y-4">
                  <li>
                    <strong>Introduction</strong>
                    <p>
                      The Questoria game and website (together referred to as
                      “Questoria”) are brought to you by Helix Winks Pty Ltd ABN
                      80 690 635 744 (“we”, “our”, or “us”). By accessing
                      Questoria, you agree to these Terms of Use. Please also
                      read our Privacy Policy which explains how we collect and
                      use personal information.
                    </p>
                  </li>

                  <li>
                    <strong>Account Registration</strong>
                    <p>
                      You must provide accurate and complete information to
                      register to play Questoria. You may not share your account
                      credentials or make your account available to anyone else
                      and are responsible for all activities that occur under
                      your account.
                    </p>
                  </li>

                  <li>
                    <strong>User Obligations</strong>
                    <p>In playing Questoria, you must comply with all applicable laws and you may not:</p>
                    <ol type="a" className="list-lower-alpha ml-6 space-y-2">
                      <li>modify, copy or distribute any part of Questoria;</li>
                      <li>attempt to or assist anyone to reverse engineer, decompile or discover the source code or underlying components of Questoria; or</li>
                      <li>interfere with or disrupt Questoria.</li>
                    </ol>
                  </li>

                  <li>
                    <strong>Termination and Suspension</strong>
                    <p>
                      You are free to stop playing Questoria at any time. We
                      may decide to discontinue Questoria at any time. We reserve
                      the right to suspend or terminate your access to Questoria
                      or delete your account if we determine:
                    </p>
                    <ol type="a" className="list-lower-alpha ml-6 space-y-2">
                      <li>you have breached these Terms of Use;</li>
                      <li>we must do so to comply with the law; or</li>
                      <li>your use of Questoria could cause risk or harm to us, our users, or anyone else.</li>
                    </ol>
                  </li>

                  <li>
                    <strong>Intellectual Property</strong>
                    <p>
                      We own or are licensed to use all the rights, title and
                      interest in Questoria. The copyright and other intellectual
                      property rights in Questoria and material displayed on
                      Questoria are owned by us or our licensors. We grant you a
                      limited licence to access and play Questoria, subject at all
                      times to your compliance with these Terms of Use.
                    </p>
                  </li>

                  <li>
                    <strong>Disclaimers and Warranties</strong>
                    <p>
                      Except to the extent prohibited by law, we make no
                      warranties (express, implied, statutory or otherwise) with
                      respect to Questoria and disclaim all warranties. We do not
                      warrant that Questoria will be uninterrupted, accurate or
                      error free.
                    </p>
                  </li>

                  <li>
                    <strong>Liability and Indemnity</strong>
                    <p>
                      We will not be liable for any indirect, incidental,
                      special, consequential, or exemplary damages, including
                      damages for loss of profits, goodwill, use, or data or
                      other losses. Our aggregate liability under these terms
                      will not exceed $100. You indemnify and hold us harmless
                      from and against any costs, losses, liabilities, and
                      expenses from third party claims arising out of or relating
                      to your use of Questoria or any violation of these Terms of
                      Use. These limitations and your indemnity applies only to
                      the maximum extent permitted by applicable law.
                    </p>
                  </li>

                  <li>
                    <strong>Changes to Terms</strong>
                    <p>
                      We may update these Terms of Use or Questoria from time to
                      time. Changes will be effective as soon as we post them to
                      Questoria. If you do not agree to the changes, you must not
                      access and must stop playing Questoria.
                    </p>
                  </li>

                  <li>
                    <strong>Entire Agreement</strong>
                    <p>
                      These Terms of Use contain the entire agreement between
                      you and us regarding Questoria. The laws of Victoria,
                      Australia will govern these Terms of Use.
                    </p>
                  </li>
                </ol>

                <p className="mt-4">December 2025</p>
              </div>

              {/* Close Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() =>  onClose?.(false)}
                  className="btn primary text-xs !flex gap-2 items-center justify-center leading-[0]"
                >
                  {closeText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
 