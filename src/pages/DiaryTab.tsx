import "swiper/swiper-bundle.min.css";

import { add, chevronBack, chevronForward } from "ionicons/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonTitle, IonToolbar } from "@ionic/react";

import DiaryDay from "../components/DiaryDay";
import FullContentLoader from "../components/FullContentLoader";
import AddHomeworkContent from "../components/HomeworkEditorContent";

interface Props {
}

// OIDTSJL:KOF:LJKFjlk FRTAMEGENTS!!!!!!

const shiftDay = (date: number | Date | string, shiftPos: number): string =>
    new Date(new Date(date).setDate(new Date(date).getDate() + shiftPos)).toDateString();

let DiaryTab: React.FC<Props> = () => {
    // STATE
    const [openAddHomeworkModal, setOpenAddHomeworkModal] = useState(false);
    const [viewDate, setViewDate] = useState(() => new Date().toDateString());

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
    //

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
            {
                canInitSwiper && <IonToolbar>
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
                </IonToolbar>
            }
        </IonHeader>
        <IonContent fullscreen>
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
                            [shiftDay(viewDate, -1), viewDate, shiftDay(viewDate, 1)].map((dateString, index) => {
                                return <SwiperSlide key={dateString}>
                                    <DiaryDay
                                        dateString={dateString}
                                    />
                                </SwiperSlide>;
                            })
                        }
                    </Swiper> : <FullContentLoader />
            }
            <IonModal isOpen={openAddHomeworkModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setOpenAddHomeworkModal(false)}>Отмена</IonButton>
                        </IonButtons>
                        <IonTitle></IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <AddHomeworkContent />
                </IonContent>
            </IonModal>
        </IonContent>
    </IonPage>;
};

export default DiaryTab;