import { Subscription, User } from "@prisma/client";
import { ReactNode } from "react"

type LayoutProps = {
    children: ReactNode
}

type sidebarOptionType = {
    title: string;
    navigateTo: string;
    icon?: React.ReactNode;
  };

type iconType = {
    size?:number,
    color?:string,
    className?:string
}

type DialogSliceType = {
    open: boolean,
    child: ReactNode
}

type AuthSliceType = {
    user: Partial<User> | null,
    subscribed: Boolean,
    subscriptionData: Partial<Subscription> | null,
    loading:Boolean
}