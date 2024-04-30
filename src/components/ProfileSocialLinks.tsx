import { ProfileSocialLinksProps } from "../interface/interfaces";

export default function ProfileSocialLinks({
  userData,
  hasSocialLinks,
}: ProfileSocialLinksProps) {
  if (!hasSocialLinks) {
    return <p>This user hasn't provided social links.</p>;
  }
  return (
    <div className="social-links text-5xl space-x-5">
      {userData.facebookLink && (
        <a href={userData.facebookLink}>
          <i className="fa-brands fa-square-facebook"></i>
        </a>
      )}
      {userData.instagramLink && (
        <a href={userData.instagramLink}>
          <i className="fa-brands fa-instagram"></i>
        </a>
      )}
      {userData.linkedinLink && (
        <a href={userData.linkedinLink}>
          <i className="fa-brands fa-linkedin"></i>
        </a>
      )}
      {userData.twitterLink && (
        <a href={userData.twitterLink}>
          <i className="fa-brands fa-square-x-twitter"></i>
        </a>
      )}
      {userData.websiteLink && (
        <a href={userData.websiteLink}>
          <i className="fa-solid fa-link"></i>
        </a>
      )}
    </div>
  );
}
