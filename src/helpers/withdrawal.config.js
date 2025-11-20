import { useTranslationWithVariables } from "./hooks/use-translation-with-vars";

// New withdrawal data for Figma design
export const getWithdrawalDataForFigma = () => {
  const { t } = useTranslationWithVariables();
  return [
    {
      col1: t("funding_data_method_cards"),
      col2: t("funding_data_processing_one_day"),
      col3: t("funding_data_fees_zero"),
      col4: t("funding_data_currencies_usd_eur"),
    },
    {
      col1: t("funding_data_method_crypto"),
      col2: t("funding_data_processing_one_day"),
      col3: t("funding_data_fees_zero"),
      col4: t("funding_data_currencies_crypto"),
    },
    {
      col1: t("funding_data_method_int_bank"),
      col2: t("funding_data_processing_one_day"),
      col3: t("funding_data_fees_zero"),
      col4: t("funding_data_currencies_int_bank"),
    },
    {
      col1: t("funding_data_method_uk_bank"),
      col2: t("funding_data_processing_one_day"),
      col3: t("funding_data_fees_zero"),
      col4: t("funding_data_currencies_uk_bank"),
    },
    {
      col1: t("funding_data_method_local_bank"),
      col2: t("funding_data_processing_one_day"),
      col3: t("funding_data_fees_zero"),
      col4: t("funding_data_currencies_local"),
    },
    {
      col1: t("funding_data_method_sticpay"),
      col2: t("funding_data_processing_one_day"),
      col3: t("funding_data_fees_zero"),
      col4: t("funding_data_currencies_sticpay"),
    },
    {
      col1: t("funding_data_method_pix"),
      col2: t("funding_data_processing_one_day"),
      col3: t("funding_data_fees_zero"),
      col4: t("funding_data_currencies_pix"),
    },
    {
      col1: t("funding_data_method_ewallets"),
      col2: t("funding_data_processing_one_day"),
      col3: t("funding_data_fees_zero"),
      col4: t("funding_data_currencies_ewallets"),
    },
  ];
};

// New deposit data for Figma design
export const getDepositDataForFigma = () => {
  const { t } = useTranslationWithVariables();
  return [
    {
      col1: t("funding_data_method_cards"),
      col2: t("funding_data_processing_instant"),
      col3: t("funding_data_min_deposit"),
      col4: t("funding_data_fees_zero"),
      col5: t("funding_data_currencies_usd_eur"),
    },
    {
      col1: t("funding_data_method_crypto"),
      col2: t("funding_data_processing_instant"),
      col3: t("funding_data_min_deposit"),
      col4: t("funding_data_fees_zero"),
      col5: t("funding_data_currencies_crypto"),
    },
    {
      col1: t("funding_data_method_int_bank"),
      col2: t("funding_data_processing_3_5_days"),
      col3: t("funding_data_min_deposit"),
      col4: t("funding_data_fees_zero"),
      col5: t("funding_data_currencies_int_bank"),
    },
    {
      col1: t("funding_data_method_uk_bank"),
      col2: t("funding_data_processing_instant_uk"),
      col3: t("funding_data_min_deposit"),
      col4: t("funding_data_fees_zero"),
      col5: t("funding_data_currencies_uk_bank"),
    },
    {
      col1: t("funding_data_method_local_bank"),
      col2: t("funding_data_processing_10_minutes"),
      col3: t("funding_data_min_deposit"),
      col4: t("funding_data_fees_zero"),
      col5: t("funding_data_currencies_local"),
    },
    {
      col1: t("funding_data_method_sticpay"),
      col2: t("funding_data_processing_instant"),
      col3: t("funding_data_min_deposit"),
      col4: t("funding_data_fees_zero"),
      col5: t("funding_data_currencies_sticpay"),
    },
    {
      col1: t("funding_data_method_pix"),
      col2: t("funding_data_processing_instant"),
      col3: t("funding_data_min_deposit"),
      col4: t("funding_data_fees_zero"),
      col5: t("funding_data_currencies_pix"),
    },
    {
      col1: t("funding_data_method_ewallets"),
      col2: t("funding_data_processing_instant"),
      col3: t("funding_data_min_deposit"),
      col4: t("funding_data_fees_zero"),
      col5: t("funding_data_currencies_ewallets"),
    },
  ];
};

export const getWithdrawalColumnsForFigma = () => {
  const { t } = useTranslationWithVariables();
  return [
    {
      accessor: "col1",
      Header: t("withdrawal_column_title1-fsa"),
    },
    {
      accessor: "col2",
      Header: t("withdrawal_column_title2-fsa"),
    },
    {
      accessor: "col3",
      Header: t("withdrawal_column_title4-fsa"),
    },
    {
      accessor: "col4",
      Header: t("withdrawal_column_title5-fsa"),
    },
  ];
};

export const getDepositColumnsForFigma = () => {
  const { t } = useTranslationWithVariables();
  return [
    {
      accessor: "col1",
      Header: t("deposit_column_title1-fsa"),
    },
    {
      accessor: "col2",
      Header: t("deposit_column_title2-fsa"),
    },
    {
      accessor: "col3",
      Header: t("deposit_column_title3-fsa"),
    },
    {
      accessor: "col4",
      Header: t("deposit_column_title4-fsa"),
    },
    {
      accessor: "col5",
      Header: t("deposit_column_title5-fsa"),
    },
  ];
};
