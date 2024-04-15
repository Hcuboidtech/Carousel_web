import React, { useEffect } from 'react';

const ArrayCreditOverviewComponent = () => {
  useEffect(() => {
    // Add script tags dynamically
    const head = document.querySelector('head');

    const arrayBaseScript = document.createElement('script');
    arrayBaseScript.src = 'https://embed.sandbox.array.io/cms/array-web-component.js';
    head.appendChild(arrayBaseScript);

    const accountEnroll = document.createElement('script');
    accountEnroll.src = `https://embed.array.io/cms/array-account-enroll.js?appKey=${process.env.REACT_APP_ARRAY_APP_KEY}`;
    head.appendChild(accountEnroll);

    const quetions = document.createElement('script');
    quetions.src = `https://embed.array.io/cms/array-authentication-kba.js?appKey=${process.env.REACT_APP_ARRAY_APP_KEY}`;
    head.appendChild(quetions);


    const arrayCreditOverviewScript = document.createElement('script');
    arrayCreditOverviewScript.src = `https://embed.sandbox.array.io/cms/array-credit-overview.js?appKey=${process.env.REACT_APP_ARRAY_APP_KEY}`;
    head.appendChild(arrayCreditOverviewScript);

    return () => {
      // Clean up script tags to avoid memory leaks
      head.removeChild(arrayBaseScript);
      head.removeChild(arrayCreditOverviewScript);
    };
  }, []);

  return (
    <>
    {/* <array-credit-overview
      appKey="3F03D20E-5311-43D8-8A76-E4B5D77793BD"
      userToken="AD45C4BF-5C0A-40B3-8A53-ED29D091FA11"
      sandbox="true"
    /> */}
    </>
   );
};

export default ArrayCreditOverviewComponent;
