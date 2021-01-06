import { useRouteMatch } from "react-router";

export default {
    // for group select just route to the root /
    CREATE_GROUP: "/create-group/",
    JOIN_GROUP: "/join-group/",
    GROUP_VIEW: "/group/"
};

const tabRelativeUrls = {
    diary: {},
    group: {
        inviteLink: true,
        members: true
    }
};

export const useTabUrls = () => {
    const match = useRouteMatch<{ groupId: string; }>();

    type RelativePaths = typeof tabRelativeUrls;
    type TabUrls = {
        [K in keyof RelativePaths]: {
            [N in keyof RelativePaths[K]]: string
        } & {
            root: string;
        }
    };

    // todo rewrite simplify tabUrls
    const TAB_URLS = Object.fromEntries(Object.entries(tabRelativeUrls).map(([tabName, relativeUrls]) => {
        return [tabName, {
            root: `${match.url}/${tabName}`,
            ...(Object.fromEntries(
                Object.entries(relativeUrls).map(([relURL]) => [relURL, `${match.url}/${tabName}/${relURL}`])
            ))
        }];
    })) as TabUrls;

    return { TAB_URLS, match };
};