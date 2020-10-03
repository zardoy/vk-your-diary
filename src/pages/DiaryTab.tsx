import { add, chevronBack, chevronForward } from "ionicons/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { gql, useQuery } from "@apollo/client";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonList,
    IonPage,
    IonSlide,
    IonSlides,
    IonTitle,
    IonToolbar,
    useIonRouter
} from "@ionic/react";

import { useSafeSelectedGroupIdVar } from "../apollo/cache";
import URLS from "../URLS";
import { GetGroupHomeworkBack, GetGroupHomeworkBackVariables } from "./__generated__/GetGroupHomeworkBack";
import { GetGroupHomeworkNext, GetGroupHomeworkNextVariables } from "./__generated__/GetGroupHomeworkNext";
import { GetGroupHomeworkNow, GetGroupHomeworkNowVariables } from "./__generated__/GetGroupHomeworkNow";

interface Props {
}

// OIDTSJL:KOF:LJKFjlk FRTAMEGENTS!!!!!!
const GET_GROUP_HOMEWORK_BACK = gql`
    query GetGroupHomeworkBack ($groupId: Int!, $dateBack: String!) {
        group(id: $groupId) {
            homeworkByDay(date: $dateBack) {
                id
                subject
                text
            }
        }
    }
`;
const GET_GROUP_HOMEWORK_NOW = gql`
    query GetGroupHomeworkNow ($groupId: Int!, $dateNow: String!) {
        group(id: $groupId) {
            homeworkByDay(date: $dateNow) {
                id
                subject
                text
            }
        }
    }
`;
const GET_GROUP_HOMEWORK_NEXT = gql`
    query GetGroupHomeworkNext ($groupId: Int!, $dateNext: String!) {
        group(id: $groupId) {
            homeworkByDay(date: $dateNext) {
                id
                subject
                text
            }
        }
    }
`;

const shiftDay = (date: number | Date | string, shiftPos: number): string =>
    new Date(new Date(date).setDate(new Date(date).getDate() + shiftPos)).toDateString();

let DiaryTab: React.FC<Props> = () => {
    const router = useIonRouter();
    const { selectedGroupId, groupSelectNeeded } = useSafeSelectedGroupIdVar();
    const swiperElRef = useRef(null as any);

    // STATE
    const [viewDate, setViewDate] = useState(() => new Date().toDateString());

    const { data: homeworkDataBack, loading: loadingBack } = useQuery<GetGroupHomeworkBack, GetGroupHomeworkBackVariables>(GET_GROUP_HOMEWORK_BACK, {
        variables: {
            groupId: selectedGroupId,
            dateNow: viewDate,
            dateBack: shiftDay(viewDate, -1),
            dateNext: shiftDay(viewDate, 1)
        },
        context: {
            loaderText: null
        },
        skip: groupSelectNeeded
    });

    const { data: homeworkDataNow, loading: loadingNow } = useQuery<GetGroupHomeworkNow, GetGroupHomeworkNowVariables>(GET_GROUP_HOMEWORK_NOW, {
        variables: {
            groupId: selectedGroupId,
            dateNow: viewDate
        },
        context: {
            loaderText: null
        },
        skip: groupSelectNeeded
    });

    const { data: homeworkDataNext, loading: loadingNext } = useQuery<GetGroupHomeworkNext, GetGroupHomeworkNextVariables>(GET_GROUP_HOMEWORK_NEXT, {
        variables: {
            groupId: selectedGroupId,
            dateNext: shiftDay(viewDate, 1)
        },
        context: {
            loaderText: null
        },
        skip: groupSelectNeeded
    });

    useEffect(() => {
        if (groupSelectNeeded) router.push(URLS.SELECT_GROUP);
    }, []);

    const changeSlideHandler = useCallback(() => {
        const swiper = swiperElRef.current?.swiper;
        if (!swiper) throw new TypeError(`Can't connect main swiper.`);
        setViewDate(viewDate => shiftDay(viewDate, swiper.activeIndex - 1));
        swiper.slideTo(1, 0, false);
    }, []);

    const changeSlide = useCallback((dir: "back" | "next") => {
        const swiper = swiperElRef.current?.swiper;
        if (!swiper) throw new TypeError(`Can't connect main swiper.`);
        dir === "back" ? swiper.slidePrev() : swiper.slideNext();
    }, []);

    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton>
                        <IonIcon slot="icon-only" icon={add} />
                    </IonButton>
                </IonButtons>
                <IonTitle>Дневник</IonTitle>
            </IonToolbar>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={() => changeSlide("back")}>
                        <IonIcon slot="icon-only" icon={chevronBack} />
                    </IonButton>
                </IonButtons>
                <IonTitle>{new Date(viewDate).toLocaleDateString()}</IonTitle>
                <IonButtons slot="end">
                    <IonButton onClick={() => changeSlide("next")}>
                        <IonIcon slot="icon-only" icon={chevronForward} />
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonSlides
                ref={swiperElRef}
                options={{
                    initialSlide: 1,
                    runCallbacksOnInit: false,
                    preventInteractionOnTransition: true
                }}
                onIonSlideDidChange={changeSlideHandler}
                style={{
                    height: "100%"
                }}
                pager
            >
                <IonSlide>
                    <IonList lines="full">
                        {}
                    </IonList>
                </IonSlide>
                <IonSlide>
                    {viewDate}
                </IonSlide>
                <IonSlide>
                    {shiftDay(viewDate, 1)}
                </IonSlide>
            </IonSlides>
        </IonContent>
    </IonPage>;
};

export default DiaryTab;