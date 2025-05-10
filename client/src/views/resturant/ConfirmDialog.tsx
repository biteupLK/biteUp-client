// components/ConfirmDialog.tsx
//when delete a product modal
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  open,
  title = "Confirm",
  content = "Are you sure you want to proceed?",
  onClose,
  onConfirm
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
