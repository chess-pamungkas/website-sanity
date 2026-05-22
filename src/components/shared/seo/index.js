import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import LanguageContext from "../../../context/language-context";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { DIR_LTR, DIR_RTL } from "../../../helpers/constants";
import { getBcp47Lang } from "../../../helpers/lang.config";

const noIndex = Boolean(Number(process.env.GATSBY_NOINDEX));
const microsoftAds = process.env.GATSBY_MICROSOFT_ADS;

const Seo = ({ title, description, fsaTitle, fsaDescription, fsaRobots }) => {
  const { selectedLanguage } = useContext(LanguageContext);
  const isRTL = useRtlDirection();

  return (
    <Helmet
      htmlAttributes={{
        lang: getBcp47Lang(selectedLanguage?.id),
        dir: isRTL ? DIR_RTL : DIR_LTR,
      }}
    >
      <title>{title || fsaTitle}</title>
      <meta name="description" content={description || fsaDescription} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
      />
      <meta name="robots" content={noIndex ? "noindex" : fsaRobots} />
      {microsoftAds && <meta name="msvalidate.01" content={microsoftAds} />}
    </Helmet>
  );
};

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  fsaTitle: PropTypes.string,
  fsaDescription: PropTypes.string,
  fsaRobots: PropTypes.string,
};

export default Seo;
