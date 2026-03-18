import ScheduleFetcher from '~/core/ScheduleFetcher';
import MatchesFetcher from '~/core/MatchesFetcher';
import MenuFetcher from '~/core/MenuFetcher';

const scheduleFetcher = new ScheduleFetcher();
const matchesFetcher = new MatchesFetcher();
const menuFetcher = new MenuFetcher();

export { scheduleFetcher, matchesFetcher, menuFetcher };
