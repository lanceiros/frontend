import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { wlFetchScreeningThunk } from '@store/ducks/prescriptions/thunk';
import { wlLoginThunk } from '@store/ducks/auth/thunk';
import WhiteLabel from '@components/WhiteLabel';

const mapStateToProps = ({ prescriptions }) => ({
  error: prescriptions.single.error,
  message: prescriptions.single.message,
  isFetching: prescriptions.single.isFetching,
  content: prescriptions.single.data,
  exams: prescriptions.single.exams
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetch: wlFetchScreeningThunk,
      login: wlLoginThunk
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(WhiteLabel);
