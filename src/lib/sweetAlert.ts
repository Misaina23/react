import Swal from 'sweetalert2';

export const sweetAlert = {
  success: (message: string) => {
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  },

  error: (message: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
    });
  },

  confirm: (title: string, text: string): Promise<boolean> => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      return result.isConfirmed;
    });
  },
};

export default sweetAlert;