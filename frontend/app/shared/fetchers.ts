import ScheduleFetcher from '~/core/ScheduleFetcher';
import MatchesFetcher from '~/core/MatchesFetcher';
import MenuFetcher from '~/core/MenuFetcher';
import UpcomingMatchesFetcher from '~/core/UpcomingMatchesFetcher';

const scheduleFetcher = new ScheduleFetcher();
const matchesFetcher = new MatchesFetcher();
const menuFetcher = new MenuFetcher();
const upcomingMatchesFetcher = new UpcomingMatchesFetcher();

export { scheduleFetcher, matchesFetcher, menuFetcher, upcomingMatchesFetcher };
