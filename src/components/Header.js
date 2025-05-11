"use client";

import React, { useEffect } from "react";
import { Navbar } from "react-bootstrap";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useTheme } from "../themecontext";
import SolanaLogo from "./SolanaLogo";
import HeaderList from "./HeaderList";
import DevelopersNav from "./DevelopersNav";
import InkeepSearchBar from "./InkeepSearchBar";
import styles from "./Header.module.scss";
import { Moon, Sun } from "lucide-react";

const Header = ({ className = "", containerClassName = "" }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isThemePage = router.asPath.includes("/developers");

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (theme === "light") {
        navbar.classList.remove("navbar-dark");
      } else {
        navbar.classList.add("navbar-dark");
      }
    }
  }, [theme, isThemePage]);

  return (
    <>
      <header className={`position-sticky sticky-top ${className}`}>
        <Navbar id="navbar" expand="lg" variant="">
          <div className={`container-xl ${containerClassName}`}>
            <Link href="/" className="d-flex" aria-label="Solana">
              <SolanaLogo
                style={{ color: "var(--body-text)" }}
                width={149}
                height={22}
              />
            </Link>

            <div className="d-flex align-items-center">
              <Navbar.Toggle
                aria-controls="navbarCollapse"
                as="button"
                type="button"
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </Navbar.Toggle>
              <Navbar.Collapse id="navbarCollapse">
                <HeaderList />
              </Navbar.Collapse>
              <InkeepSearchBar />
              {isThemePage && (
                <button
                  className={styles.header__toggle}
                  onClick={toggleTheme}
                  aria-label={t("commands.toggle")}
                >
                  {theme === "light" && <Moon />}
                  {theme === "dark" && <Sun />}
                </button>
              )}
            </div>
          </div>
        </Navbar>
      </header>
      {(router.asPath.includes("/developers") ||
        router.asPath.includes("/docs")) && (
        <DevelopersNav containerClassName={containerClassName} />
      )}
    </>
  );
};

export default Header;
