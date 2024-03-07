import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { Card, CardProps } from "../components/Card";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import React from "react";
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import { useHistory } from "@docusaurus/router";
import styles from "./styles.module.css";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const histroy = useHistory();

  const POOLS = (siteConfig.customFields!.pools as PoolCardProps[]).filter(
    (x) => !x.name.includes("State-Sync")
  );

  const CARDS: CardProps[] = [
    {
      title: "How to delegate",
      desc: "Discover how KYVE is enabling validators, applications, and builder alike to bring their data experiences to the next level.",
      img: "img/homepage/learn.svg",
      href: "/community/delegating",
    },
    {
      title: "KSYNC",
      desc: "Discover how KYVE is enabling validators, applications, and builder alike to bring their data experiences to the next level.",
      img: "img/homepage/community.svg",
      href: "/validators/ksync",
    },
    {
      title: "Own runtime",
      desc: "Discover how KYVE is enabling validators, applications, and builder alike to bring their data experiences to the next level.",
      img: "img/homepage/validators.png",
      href: "/validators",
    },
    {
      title: "Access the data",
      desc: "Discover how KYVE is enabling validators, applications, and builder alike to bring their data experiences to the next level.",
      img: "img/homepage/developers.png",
      href: "/developers",
    },
  ];

  return (
    <Layout>
      <main className="container py-12">
        <div className="grid grid-cols-2 items-center">
          <div className="col-span-2 md:col-span-1">
            <ThemedImage
              alt="logo"
              sources={{
                dark: useBaseUrl("/img/homepage/logo_white.svg"),
                light: useBaseUrl("/img/homepage/logo.svg"),
              }}
            ></ThemedImage>
            <div className="text-5xl font-bold mt-16">
              We need some good looking text{" "}
              <span className="text-primary">here!</span>
            </div>
            <div className="mt-8">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet.
            </div>
            <div className="mt-8 flex flex-nowrap">
              <div
                className="bg-[#58C6B2] rounded-xl py-2.5 px-3 text-white btn-primary mr-4 hover:cursor-pointer"
                onClick={() => histroy.push("validators/chain_nodes/overview")}
              >
                Validate The Network
              </div>
              <div
                className="rounded-xl py-2.5 px-3 border border-solid border-black text-black dark:text-white dark:border-white hover:cursor-pointer"
                onClick={() =>
                  histroy.push("/developers/development/developing_runtime")
                }
              >
                Build Your Own Data Rollup
              </div>
            </div>
          </div>
          <div className="flex justify-center col-span-2 md:col-span-1">
            <img
              className="hidden sm:visible sm:flex"
              draggable={false}
              src="/img/homepage/kyve-markup.svg"
            ></img>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 mt-8">
          {CARDS.map((x, i) => (
            <div
              key={i}
              className="col-span-4 sm:col-span-4 md:col-span-2 lg:col-span-1"
            >
              <Card {...x} delay={i * 150} />
            </div>
          ))}
        </div>
        <div>
          <div className="font-bold text-3xl mt-8">Archived on Mainnet</div>
          <div className="grid grid-cols-6 gap-6 mt-8"></div>
        </div>
        <Splide
          options={{
            rewind: true,
            arrows: false,
            breakpoints: {
              1024: {
                perPage: 2,
              },
              640: {
                perPage: 1,
              },
            },
            perPage: 3,
            gap: 10,
            type: "loop",
            pagination: false,
          }}
          extensions={{ AutoScroll }}
        >
          {POOLS.map((x, i) => (
            <SplideSlide
              key={i}
              className="py-2"
              onClick={() =>
                histroy.push(
                  `/validators/protocol_nodes/pools/${x.name
                    .toLowerCase()
                    .split(" ")
                    .join("_")}/overview`
                )
              }
            >
              <div className="col-span-6 sm:col-span-6 md:col-span-3 lg:col-span-2">
                <PoolCard {...x} />
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </main>
    </Layout>
  );
}
