import { Flex, Spin } from "antd";
import React, { useRef } from "react";
import { useIsVisible } from "../../hooks";

interface IProps {
  next: () => void;
  isFetchingNextPage: boolean;
}

export const TableInfinitteScroll: React.FC<IProps> = ({ next, isFetchingNextPage }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isIntersecting = useIsVisible(ref);

  React.useEffect(() => {
    if (isIntersecting && !isFetchingNextPage) {
      next();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting, isFetchingNextPage]);

  return (
    <Flex align="middle" justify="center" ref={ref} style={{ padding: "10px 0" }}>
      <Spin size="small" />
    </Flex>
  );
};
