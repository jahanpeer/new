import React from "react";

const About = () => {
  return (
    <div className="about">
      <h3>About</h3>
      <p>
        This website lets you to shorten any YouTube video link to share it with
        your friends via e-mail, Twitter, WhatsApp or any other platform. Just
        paste your link in the above box and click on <b>"Shorten"</b> to get a
        shareable shortened URL.
      </p>
      <p>
        By clicking on the <b>"Lock"</b> icon, you can also encrypt your video
        link and decrypt it later with the same key as provided at the time of
        encryption.
        <br />
        The <b>"Recent Links"</b> takes you to the page where you can view all
        the recent links and clicking on one of the thumbnails will play your
        video in embed.
      </p>
    </div>
  );
};

export default About;
