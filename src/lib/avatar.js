/**
 * Avatar defaults and preset demo avatars
 */
export const DEFAULT_AVATAR = "/demo-avatar.svg";

export const DEMO_AVATARS = [
  {
    id: "default",
    name: "Classic Indigo",
    url: "/demo-avatar.svg",
  },
  {
    id: "alex",
    name: "Modern Professional",
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: "sarah",
    name: "Creative Mind",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: "david",
    name: "Tech Specialist",
    url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: "emma",
    name: "Productivity Star",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
  },
];

/**
 * Returns a valid avatar URL or falls back to DEFAULT_AVATAR
 */
export function getAvatarUrl(photoUrl) {
  if (!photoUrl || typeof photoUrl !== "string" || photoUrl.trim() === "") {
    return DEFAULT_AVATAR;
  }
  return photoUrl;
}
