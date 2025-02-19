import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  selectItemToSaveThunk,
  saveInterventionThunk,
  clearSavedInterventionStatusThunk
} from '@store/ducks/intervention/thunk';
import {
  checkScreeningThunk,
  checkPrescriptionDrugThunk,
  updateInterventionDataThunk,
  checkInterventionThunk,
  fetchPrescriptionDrugPeriodThunk
} from '@store/ducks/prescriptions/thunk';
import { selectPrescriptionDrugThunk } from '@store/ducks/prescriptionDrugs/thunk';
import PrescriptionDrugList from '@components/Screening/PrescriptionDrug/PrescriptionDrugList';

const mapStateToProps = ({ prescriptions, auth }) => ({
  dataSource: prescriptions.single.diet.list,
  listRaw: prescriptions.single.data.dietRaw,
  isFetching: prescriptions.single.isFetching,
  headers: prescriptions.single.data.headers,
  aggregated: prescriptions.single.data.agg,
  checkPrescriptionDrug: prescriptions.single.diet.checkPrescriptionDrug,
  checkIntervention: prescriptions.single.diet.checkIntervention,
  periodObject: prescriptions.single.diet.period,
  access_token: auth.identify.access_token,
  weight: prescriptions.single.data.weight,
  idSegment: prescriptions.single.data.idSegment,
  admissionNumber: prescriptions.single.data.admissionNumber,
  uniqueDrugs: prescriptions.single.data.uniqueDrugs,
  isCheckingPrescription: prescriptions.single.check.isChecking
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkScreening: checkScreeningThunk,
      fetchPeriod: fetchPrescriptionDrugPeriodThunk,
      select: selectItemToSaveThunk,
      save: saveInterventionThunk,
      reset: clearSavedInterventionStatusThunk,
      savePrescriptionDrugStatus: checkPrescriptionDrugThunk,
      updateInterventionData: updateInterventionDataThunk,
      saveInterventionStatus: checkInterventionThunk,
      selectPrescriptionDrug: selectPrescriptionDrugThunk
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionDrugList);
