import { useEffect } from "react";

interface Props {
  hash: string;
  onOpen: () => void;
  onClose: () => void;
}

export const useLocationHash = ({ hash, onOpen, onClose }: Props) => {
  const handleOpen = () => {
    onOpen();
    if (window.location.hash !== `#${hash}`) {
      window.location.hash = `#${hash}`;
    }
  };
  const handleClose = () => {
    onClose();
    if (window.location.hash === `#${hash}`)
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
  };

  /**
   * Auto open and close
   */
  useEffect(() => {
    if (location.hash === `#${hash}`) handleOpen();
    else handleClose();
  }, [location.hash]);

  return { handleOpen, handleClose };
};
