import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface PaymentFormProps {
  bookingData: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentForm({ bookingData, isOpen, onClose, onSuccess }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  if (!bookingData) return null;

  const { room, checkIn, checkOut, firstName, lastName, email, phone, totalPrice, nights } = bookingData;
  const prepayment = Math.round(totalPrice * 0.3);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const isFormValid = cardNumber.length >= 19 && expiryDate.length === 5 && cvv.length === 3 && cardName.length > 0;

  const handlePayment = async () => {
    if (!isFormValid) return;

    setIsProcessing(true);
    setStep(2);

    // Simulate payment processing
    setTimeout(() => {
      setStep(3);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 1500);
    }, 2000);
  };

  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'American Express';
    return 'Карта';
  };

  if (isProcessing) {
    return (
      <Dialog open={isOpen} onOpenChange={!isProcessing ? onClose : undefined}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Обработка платежа</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <div className="space-y-4">
              {step >= 1 && (
                <div className="flex items-center space-x-3">
                  <Icon name={step > 1 ? "CheckCircle" : "Circle"} className={`w-5 h-5 ${step > 1 ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={step > 1 ? 'text-green-600' : 'text-gray-600'}>Проверка данных карты</span>
                </div>
              )}
              
              {step >= 2 && (
                <div className="flex items-center space-x-3">
                  <Icon name={step > 2 ? "CheckCircle" : "Circle"} className={`w-5 h-5 ${step > 2 ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={step > 2 ? 'text-green-600' : 'text-gray-600'}>Обработка платежа</span>
                </div>
              )}
              
              {step >= 3 && (
                <div className="flex items-center space-x-3">
                  <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />
                  <span className="text-green-600">Бронирование подтверждено</span>
                </div>
              )}
            </div>
            
            <Progress value={step * 33.33} className="w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Оплата бронирования</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Детали бронирования</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{room.name}</h3>
                    <Badge variant="secondary" className="text-xs">{room.type}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Заезд:</span>
                    <span>{checkIn ? format(checkIn, 'dd MMM yyyy', { locale: ru }) : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Выезд:</span>
                    <span>{checkOut ? format(checkOut, 'dd MMM yyyy', { locale: ru }) : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ночей:</span>
                    <span>{nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Гость:</span>
                    <span>{firstName} {lastName}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Стоимость номера</span>
                    <span>{(totalPrice - Math.round(totalPrice * 0.1)).toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Сервисный сбор</span>
                    <span>{Math.round(totalPrice * 0.1).toLocaleString()} ₽</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Общая стоимость</span>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-primary font-semibold">
                    <span>К оплате сейчас (30%)</span>
                    <span>{prepayment.toLocaleString()} ₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Icon name="Info" className="h-4 w-4" />
              <AlertDescription>
                После оплаты вы получите подтверждение на email {email}
              </AlertDescription>
            </Alert>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Данные карты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Номер карты</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="pr-20"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Badge variant="outline" className="text-xs">
                        {getCardType(cardNumber)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiryDate">Срок действия</Label>
                    <Input
                      id="expiryDate"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      type="password"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardName">Имя владельца карты</Label>
                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="IVAN PETROV"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Icon name="Shield" className="w-4 h-4" />
                  <span>Защищенная SSL-связь. Ваши данные в безопасности.</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Назад
              </Button>
              <Button
                onClick={handlePayment}
                disabled={!isFormValid}
                className="flex-1 bg-primary hover:bg-primary-600"
              >
                <Icon name="Lock" className="w-4 h-4 mr-2" />
                Оплатить {prepayment.toLocaleString()} ₽
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}