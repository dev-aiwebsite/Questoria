"use client";

import { AnimatePresence, motion } from "framer-motion";


type PopupProps= {
  triggerClassName?:string;
  triggerText?: string;
  open?: boolean;
  onClose?: (v:boolean) => void;
  isTriggerHidden?:boolean;
}
export default function TermsOfUsePopup({isTriggerHidden, onClose, open =false, triggerClassName, triggerText = "Privacy Policy" }:PopupProps) {

  return (
    <>
      {/* Trigger Button - label it anything */}
      {!isTriggerHidden && 
      <button
         onClick={() => onClose?.(true)}
        className={triggerClassName}
      >{triggerText}
      </button>
      }

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
               {/* Your Content */}
              <div className="text-sm space-y-4 font-medium">
                <h3 className="text-center header3 !mb-6">Our commitment to privacy:</h3>


                <p>
                  The Questoria game and website (together referred to as “
                  <span className="font-bold">Questoria</span>”) are brought to you by{" "}
                  <span className="font-bold">Helix Winks Pty Ltd</span> ABN 80 690 635 744
                  (“<span className="font-bold">we</span>”, “
                  <span className="font-bold">our</span>”, or “
                  <span className="font-bold">us</span>”). We are committed to protecting
                  your privacy. In this Privacy Policy we explain how we collect, store,
                  safeguard, use and disclose your personal information.
                </p>

                <p className="font-bold">Your consent to this Privacy Policy</p>

                <p>
                  By accessing Questoria, you agree to our collection, storage, use, and
                  disclosure of your personal information as described in this Privacy
                  Policy.
                </p>

                <p className="font-bold">The Australian Privacy Principles</p>

                <p>
                  We comply with the Australian Privacy Principles (the “
                  <span className="font-bold">APPs</span>”) contained in the Privacy Act
                  1988 (Cth) (the “<span className="font-bold">Privacy Act</span>”). A
                  copy of the APPs may be obtained from{" "}
                  <a
                    href="http://oaic.gov.au/"
                    className="text-blue-600 hover:underline"
                  >
                    the website of The Office of the Australian Information Commissioner
                  </a>
                  .
                </p>

                <p className="font-bold">Why do we collect personal information?</p>

                <p>
                  We collect your personal information for the primary purpose of providing
                  Questoria to you. We may also use your personal information for secondary
                  purposes closely related to the primary purpose, in circumstances where
                  you would reasonably expect such use or disclosure.
                </p>

                <p className="font-bold">What personal information may we collect from you?</p>

                <p>
                  The primary types of personal information we may collect include your
                  name, email address and login. We collect this personal information
                  through the registration process for Questoria.
                </p>

                <p className="font-bold">How do we share the information we collect from you?</p>

                <p>
                  We may engage trusted third party service providers to perform functions
                  and provide services to us, such as hosting providers and communication
                  platforms. All third parties are bound by confidentiality and data
                  protection obligations. We share your personal information with these
                  third parties to enable them to perform these services for us and for
                  you.
                </p>

                <p>
                  We may also disclose personal and non-personal information about you to
                  government or law enforcement officials to respond to claims and legal
                  processes to protect our rights and interests or those of a third party
                  and the safety of the public or any person, to prevent or stop any
                  illegal, unethical, or legally actionable activity, or to otherwise
                  comply with applicable court orders, laws, rules and regulations.
                </p>

                <p className="font-bold">How do we use the information we collect?</p>

                <p>We use your personal information to:</p>

                <ul className="list-disc ml-6">
                  <li>deliver Questoria to you;</li>
                  <li>communicate with you; and</li>
                  <li>manage payments and subscriptions.</li>
                </ul>

                <p>We will never sell your personal information.</p>

                <p className="font-bold">Use of email address for marketing purposes</p>

                <p>
                  By providing your email address to us, you agree to receive marketing
                  emails from us. We do not send unsolicited marketing emails. If at any
                  time you would like to unsubscribe from receiving future marketing
                  emails, we include detailed unsubscribe instructions at the bottom of
                  each email.
                </p>

                <p className="font-bold">No collection of ‘Sensitive Information’</p>

                <p>
                  We do not collect Sensitive Information as defined in the Privacy Act
                  (information about racial or ethnic origin, political opinions,
                  membership of a political association, religious or philosophical
                  beliefs, criminal record or health information).
                </p>

                <p className="font-bold">How long do we keep your information?</p>

                <p>
                  We keep your information only so long as we need it to provide Questoria
                  to you and fulfill the purposes described in this Privacy Policy. When we
                  no longer need to use your information and there is no need for us to
                  keep it to comply with our legal or regulatory obligations, we will
                  either remove it from our systems or depersonalise it so that we can’t
                  identify you.
                </p>

                <p className="font-bold">How do we protect your information?</p>

                <p>
                  Your personal information is stored in a manner that reasonably protects
                  it from misuse and loss and from unauthorised access, modification or
                  disclosure. We implement security measures to maintain the safety of
                  your personal information when you submit or access your personal
                  information.
                </p>

                <p className="font-bold">How can I access, update or correct my information?</p>

                <p>You can contact us in order to:</p>

                <ol className="list-decimal ml-6">
                  <li>update or correct your personal information;</li>
                  <li>change your preferences with respect to communications and other information you receive from us; or</li>
                  <li>delete the personal information maintained about you on our systems.</li>
                </ol>

                <p>
                  If you wish to access your personal information, please contact us at{" "}
                  <a href="mailto:hello@helixwinks.com" className="text-blue-600 hover:underline">
                    hello@helixwinks.com
                  </a>
                  . Please be aware that it is not technologically possible to remove each
                  and every record of the information you have provided to us from our
                  system.
                </p>

                <p className="font-bold">Cookies</p>

                <p>
                  We may use cookies and other tracking devices for the purpose of
                  enhancing the performance and functionality of Questoria. You may disable
                  Cookies that are non-essential to your use of Questoria.
                </p>

                <p className="font-bold">Changes to our Privacy Policy</p>

                <p>
                  We may make changes to this Privacy Policy so that it accurately reflects
                  our policies and operations. Continued use of Questoria, direct
                  engagement with us, or following the publication of changes to this
                  Privacy Policy will mean that you accept those changes. If you do not
                  want to agree to this or any updated Privacy Policy, you can discontinue
                  using Questoria.
                </p>

                <p className="font-bold">Governing law</p>

                <p>This Privacy Policy is governed by the laws of Victoria, Australia.</p>

                <p className="font-bold">Making a complaint</p>

                <p>
                  If you wish to complain about our handling of your personal information,
                  you may lodge a complaint by contacting us at{" "}
                  <a href="mailto:hello@helixwinks.com" className="text-blue-600 hover:underline">
                    hello@helixwinks.com
                  </a>
                  . We will investigate your complaint and provide a response within a
                  reasonable period of time. If you remain unhappy with the way we have
                  handled your personal information or you are not satisfied with the way
                  in which we have handled your complaint, you may lodge a complaint with
                  the{" "}
                  <a
                    href="https://www.oaic.gov.au/privacy/privacy-complaints"
                    className="text-blue-600 hover:underline"
                  >
                    Office of the Australian Information Commissioner
                  </a>
                  .
                </p>

                <p>
                  If you have any questions about this Privacy Policy, please do not
                  hesitate to contact us at{" "}
                  <a href="mailto:hello@helixwinks.com" className="text-blue-600 hover:underline">
                    hello@helixwinks.com
                  </a>
                  .
                </p>

                <p className="italic">December 2025</p>
              </div>

              {/* Close Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() =>  onClose?.(false)}
                  className="btn primary text-xs"
                >
                  I have read and fully understand.
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
 