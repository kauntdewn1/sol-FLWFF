import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import styled from "styled-components";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";

const Direction = {
  LEFT: -1,
  RIGHT: 1,
  NONE: 0,
};

const StyledCarouselCards = styled.div`
  padding-right: 0;
  padding-left: 0;
  position: relative;

  .carousel-cards {
    & > div {
      column-gap: 1.5rem;
      margin-right: 0;
      margin-left: 0;
      & > div {
        max-width: 15rem;
        min-width: 15rem;
        @media (min-width: 576px) {
          max-width: 20rem;
          min-width: 20rem;
        }
      }
    }

    // Add Horizontal-Scrollbar.
    overflow: auto !important;
    // Hide it visually.
    // This will hide the scrollbar in mozilla based browsers.
    overflow: -moz-scrollbars-none;
    scrollbar-width: none;
    // This will hide the scrollbar in internet explorers.
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      width: 0 !important;
      display: none;
    }

    .bg-track-card {
      min-width: 255px;
      margin-right: 20px;
      // Add scroll gap at start.
      &:first-of-type {
        margin-left: 20px;
      }
    }
    // Prevent collapsing of scroll gap at end.
    .horizontal-bumper {
      min-width: 1px;
    }
  }

  .overlay-left,
  .overlay-right {
    position: absolute;
    top: 0;
    bottom: 0;
    display: none !important;
    z-index: 100;
    transition: opacity 0.3s;
  }

  .overlay-left {
    left: 0;
    border: none;
    left: -20px;
  }

  .overlay-right {
    right: 0;
    border: none;
    right: -20px;
  }

  &[data-overflowing="both"],
  &[data-overflowing="left"] {
    .overlay-left {
      display: flex !important;
    }
  }

  &[data-overflowing="both"],
  &[data-overflowing="right"] {
    .overlay-right {
      display: flex !important;
    }
  }
`;

/**
 * Calculates which Arrow(s) to display.
 *
 * @param container
 * @param content
 * @returns {string}
 */
const determineArrowPosition = (container, content) => {
  const contentWidth = content.scrollWidth;
  const contentUIWidth = Math.floor(contentMetrics.width);

  const scrollLeft = container.scrollLeft;
  const maxScroll = contentUIWidth + scrollLeft >= contentWidth;

  if (scrollLeft === 0) {
    return "right";
  }

  if (maxScroll) {
    return "left";
  }

  if (!maxScroll) {
    return "both";
  }

  return "none";
};

/**
 * Regional Tracks, Prizes & seed Funding.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const CarouselCards = ({ children }) => {
  const timerIdRef = useRef();
  const wrapperRef = useRef();
  const contentRef = useRef();
  const [dataPos, setDataPos] = useState("none");
  const [scroll, setScroll] = useState(Direction.NONE);

  const onScroll = useCallback(() => {
    setDataPos(
      determineArrowPosition(wrapperRef.current, contentRef.current),
    );
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && wrapperRef.current) {
      wrapperRef.current.addEventListener("scroll", handleScroll);
      return () => {
        wrapperRef.current.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  const stopScroll = useCallback(() => {
    setScroll(Direction.NONE);
  }, []);

  const scrollToLeft = useCallback(() => {
    if (!wrapperRef.current) {
      return;
    }

    const currentPos = wrapperRef.current.scrollLeft;

    let nextPos = currentPos - 264;

    if (nextPos < 0) {
      nextPos = 0;
      stopScroll(0);
    }

    wrapperRef.current.scrollTo({
      top: 0,
      left: nextPos,
      behavior: "smooth",
    });
  }, [stopScroll]);

  const scrollToRight = useCallback(() => {
    if (!wrapperRef.current) {
      return;
    }

    const maxScrollLeft =
      wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth;
    const currentPos = wrapperRef.current.scrollLeft;

    let nextPos = currentPos + 264;

    if (nextPos > maxScrollLeft) {
      nextPos = maxScrollLeft;
      stopScroll(0);
    }

    wrapperRef.current.scrollTo({
      top: 0,
      left: nextPos,
      behavior: "smooth",
    });
  }, [stopScroll]);

  const handleScroll = useCallback(
    (direction) => {
      if (direction === Direction.LEFT) {
      }

      if (direction === Direction.RIGHT) {
      }
    },
    [scrollToLeft, scrollToRight],
  );

    if (scroll !== 0 && !timerIdRef?.current) {
      timerIdRef.current = setInterval(() => handleScroll(scroll), 80);
    } else {
      timerIdRef.current = null;
    }

    return () => {
    };
  }, [handleScroll, scroll]);

  // #region (Persistent) Mouse down handlers

  const onLeftBtnMouseDown = useCallback(() => {
    setScroll(Direction.LEFT);
  }, []);

  const onRightBtnMouseDown = useCallback(() => {
    setScroll(Direction.RIGHT);
  }, []);

  // #endregion

  // #region Touch handlers

  const onTouchStartHandle = useCallback(
    (direction) => {
      // scroll once for single touch
      handleScroll(direction);
    },
    [handleScroll],
  );

  const onLeftBtnTouchStart = useCallback(() => {
    onTouchStartHandle(Direction.LEFT);
    setScroll(Direction.LEFT);
  }, [onTouchStartHandle]);

  const onRightBtnTouchStart = useCallback(() => {
    onTouchStartHandle(Direction.RIGHT);
    setScroll(Direction.RIGHT);
  }, [onTouchStartHandle]);

  const onTouchEnd = useCallback(
    (e) => {
      stopScroll();
    },
    [stopScroll],
  );

  // #endregion

  // #region (Single) Click handlers

  const onLeftBtnClick = useCallback(() => {
  }, [scrollToLeft]);

  const onRightBtnClick = useCallback(() => {
  }, [scrollToRight]);

  // #endregion


  return (
    <StyledCarouselCards className="py-2" data-overflowing={dataPos || "none"}>
      <div ref={wrapperRef} className="carousel-cards">
        <div className="d-flex flex-row flex-nowrap" ref={contentRef}>
          {children}
        </div>
      </div>
      <button
        className="overlay-left justify-content-center align-items-center btn btn-link text-white"
        aria-label={developers.carousel.prev}
        onMouseDown={onLeftBtnMouseDown}
        onMouseUp={stopScroll}
        onMouseLeave={stopScroll}
        onTouchStart={onLeftBtnTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onLeftBtnClick}
      >
        <ArrowLeft />
      </button>
      <button
        className="overlay-right justify-content-center align-items-center btn btn-link text-white"
        aria-label={developers.nav.next}
        onMouseDown={onRightBtnMouseDown}
        onMouseUp={stopScroll}
        onMouseLeave={stopScroll}
        onTouchStart={onRightBtnTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onRightBtnClick}
      >
        <ArrowRight />
      </button>
    </StyledCarouselCards>
  );
};

export default CarouselCards;
