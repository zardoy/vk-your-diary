import "swiper/swiper-bundle.min.css";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { add, chevronBack, chevronForward } from "ionicons/icons";
import { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { IonButton, IonButtons, IonIcon, IonTitle, IonToolbar } from "@ionic/react";

import DiaryDay from "../../components/DiaryDay";
import FullContentLoader from "../../components/FullContentLoader";
import Page from "../../components/Page";
import { useModalController } from "../../lib/useModalController";
import HomeworkEditorModal from "./HomeworkEditor";

interface Props {
}

const shiftDay = (date: number | Date | string, shiftPos: number): string =>
    new Date(new Date(date).setDate(new Date(date).getDate() + shiftPos)).toISOString().split("T")[0];

let DiaryTab: React.FC<Props> = () => {
    // STATE
    const [viewDate, setViewDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [editingHomeworkId, setEditingHomeworkId] = useState(null as null | number);

    // SWIPER LOGIC START
    const swiperInstance = useRef(null as null | SwiperInstance);
    const [canInitSwiper, setCanInitSwiper] = useState(false);

    useEffect(() => {
        const isHydrated = () => document.documentElement.classList.contains("hydrated");
        if (isHydrated()) {
            setCanInitSwiper(true);
        } else {
            // боже, ionic
            const observer = new MutationObserver((_, observer) => {
                if (isHydrated()) setCanInitSwiper(true);
                observer.disconnect();
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        }
    }, []);

    const changeSlide = useCallback((direction: "back" | "forward") => {
        // todo show warning toast
        let { current: swiper } = swiperInstance;
        if (!swiper) return;
        direction === "back" ? swiper.slidePrev() : swiper.slideNext();
    }, []);

    const slideChangeHandle = useCallback(() => {
        let { current: swiper } = swiperInstance;
        if (!swiper) throw new TypeError(`Swiper instance is not ready in React FC.`);
        setViewDate(date => shiftDay(date, swiper!.activeIndex - 1));
        swiper.slideTo(1, 0, false);
    }, []);

    const homeworkEditorModalState = useModalController({
        // clear on state on modal close
        onStateUpdate: (newState) => newState === "closed" && setEditingHomeworkId(null)
    });

    const AddHomeworkButton = <IonButton>
        <IonIcon slot="icon-only" icon={add} onClick={homeworkEditorModalState.openModal} />
    </IonButton>;

    const SubNavbar = canInitSwiper ? <IonToolbar>
        <IonButtons slot="start">
            <IonButton onClick={() => changeSlide("back")}>
                <IonIcon slot="icon-only" icon={chevronBack} />
            </IonButton>
        </IonButtons>
        <IonTitle>{new Date(viewDate).toLocaleDateString()}</IonTitle>
        <IonButtons slot="end">
            <IonButton onClick={() => changeSlide("forward")}>
                <IonIcon slot="icon-only" icon={chevronForward} />
            </IonButton>
        </IonButtons>
    </IonToolbar> : undefined;

    return <Page title="Дневник" backButton={AddHomeworkButton} subNavbar={SubNavbar}>
        <HomeworkEditorModal controller={homeworkEditorModalState} editingHomeworkId={editingHomeworkId} />
        {
            canInitSwiper ?
                <Swiper
                    onSwiper={swiper => swiperInstance.current = swiper}
                    className="ios slides-ios swiper-container"
                    style={{
                        height: "100%"
                    }}
                    onSlideChangeTransitionEnd={slideChangeHandle}
                    initialSlide={1}
                    runCallbacksOnInit={false}
                >
                    {
                        [shiftDay(viewDate, -1), viewDate, shiftDay(viewDate, 1)].map((dateString) => {
                            return <SwiperSlide key={dateString}>
                                <DiaryDay
                                    dateString={dateString}
                                />
                            </SwiperSlide>;
                        })
                    }
                </Swiper> : <FullContentLoader />
        }
    </Page>;
};

export default DiaryTab;