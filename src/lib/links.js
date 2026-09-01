// External membership signup on Athletics Ireland's portal. Every "Join the club" /
// "Become a member" CTA points here — update the URL in this one place if it changes.
export const JOIN_URL =
  "https://membership.athleticsireland.ie/mmm/newmembership/selection.html?club=64e56dd6-2751-4f65-9323-c4fd87733873"

// Club contact address. CONTACT_MAILTO opens a new email with the topic pre-filled
// (?subject=, %20 = space; add &body=... to pre-fill the message). The sender can
// still edit it before sending. Used by the footer and the Train-with-us section.
export const CONTACT_EMAIL = "cshnewmembers@gmail.com"
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=New%20membership%20enquiry`
