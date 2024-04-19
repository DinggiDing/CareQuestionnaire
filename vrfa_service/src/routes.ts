/* eslint-disable */
import ReviewSurvey from "./pages/review/ReviewSurvey";
import Welcome from "./pages/Welcome";
import MicrophonePermission from "./pages/MicrophonePermission";
import CurriculumAdminHome from "./pages/curriculum_admin/CurriculumAdminHome";
import CurriculumAddParticipant from './pages/curriculum_admin/CurriculumAddParticipant';
import LoginPage from './pages/auth/Login';
import CurriculumCreateParticipant from './pages/curriculum_admin/CurriculumCreateParticipant';
import CurriculumParticipantOverview from './pages/curriculum_admin/CurriculumParticipantOverview';
import CurriculumManageActivities from './pages/curriculum_admin/CurriculumManageActivities'
import ChatHome from "./pages/chat/ChatHome";
import CurriculumViewer from "./pages/curriculum/CurriculumViewer";
import CurriculumAllParticipantOverview from "./pages/curriculum_admin/CurriculumAllParticipantOverview";


interface RouteProp {
    key: string,
    title: string,
    path: string,
    children?: RouteProp[],
    useAuth?: boolean,
    component: () => JSX.Element
}

export const routes: Array<RouteProp> = [
    {
        key: 'login',
        title: 'Login to vRFA',
        useAuth: true,
        path: '/login',
        component: LoginPage
    },
    {
        key: 'vrfa',
        title: 'VRFA',
        useAuth: true,
        path: '/start',
        component: ChatHome
    },
    {
        key: 'startup',
        title: 'Welcome',
        useAuth: true,
        path: '/',
        component: MicrophonePermission
    },
    {
        key: 'startup',
        title: 'Welcome',
        useAuth: true,
        path: '/welcome',
        component: Welcome
    },
    {
        key: 'review',
        title: 'Review survey',
        useAuth: true,
        path: '/review',
        component: ReviewSurvey
    },
    {   
        key: 'curriculum-admin',
        title: 'Curriculum Admin',
        useAuth: true,
        path: '/curriculum-admin',
        component: CurriculumAdminHome,
        children: [{
            title: 'Curriculum Admin',
            key: 'overview',
            path: 'overview',
            component: CurriculumAllParticipantOverview,
          },
          {
            title: 'Curriculum Admin',
            key: 'add-participant',
            path: 'add-participant',
            component: CurriculumCreateParticipant,
          },
          {
            title: 'Participant Curriculum',
            key: 'participant-info',
            path: 'participant/:id',
            component: CurriculumParticipantOverview, 
          },
          {
            title: 'Manage Activities',
            key: 'activity-info',
            path: 'manage-activities',
            component: CurriculumManageActivities, 
          }
        ]
    },
    {
        key: 'curriculum',
        title: 'Curriculum',
        path: '/curriculum/:id',
        component: CurriculumViewer, 
    }
];