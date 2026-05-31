import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingModal } from '../BookingModal';

describe('BookingModal', () => {
  it('affiche le titre et valide le formulaire', async () => {
    const onClose = vi.fn();
    const onProceedToPayment = vi.fn();

    render(
      <BookingModal
        isOpen={true}
        onClose={onClose}
        packName="Pack Test"
        packPrice="10000"
        onProceedToPayment={onProceedToPayment}
      />
    );

    expect(screen.getByText('Réserver Pack Test')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('votre@email.com')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Continuer vers le paiement/i });
    await userEvent.click(submitButton);

    expect(onProceedToPayment).not.toHaveBeenCalled();
  });
});
