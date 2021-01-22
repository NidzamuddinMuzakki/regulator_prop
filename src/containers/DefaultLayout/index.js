import DefaultLayout from './DefaultLayout';

import authMethod from '../../auth/authMethod';
import withAuth from '../../auth/withAuth';





export default withAuth(DefaultLayout);
// export default (DefaultLayout);