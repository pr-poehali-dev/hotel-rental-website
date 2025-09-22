import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { format, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  features: string[];
  rating: number;
  reviews: number;
  size: number;
  guests: number;
  beds: number;
}

interface BookingFormProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onPayment: (bookingData: any) => void;
}

interface BookingData {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalPrice: number;
  nights: number;
}

export default function BookingForm({ room, isOpen, onClose, onPayment }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!room) return null;

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = nights * room.price;
  const serviceFee = Math.round(totalPrice * 0.1);
  const finalPrice = totalPrice + serviceFee;

  const isFormValid = checkIn && checkOut && firstName && lastName && email && phone && nights > 0;

  const handleBooking = () => {
    if (!isFormValid) return;

    const bookingData: BookingData = {
      checkIn,
      checkOut,
      guests,
      firstName,
      lastName,
      email,
      phone,
      totalPrice: finalPrice,
      nights
    };

    onPayment({ ...bookingData, room });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Бронирование номера</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <Badge variant="secondary">{room.type}</Badge>
                  <div className="flex items-center mt-1">
                    <Icon name="Star" className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm">{room.rating} ({room.reviews} отзывов)</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold text-primary">{room.price.toLocaleString()} ₽</div>
                  <div className="text-sm text-gray-500">за ночь</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Guests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Даты и гости</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Заезд</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, 'dd MMM yyyy', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Выезд</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, 'dd MMM yyyy', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => date <= (checkIn || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Количество гостей</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: room.guests }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1} {i === 0 ? 'гость' : i < 4 ? 'гостя' : 'гостей'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ваша фамилия"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          {nights > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Детали оплаты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>{room.price.toLocaleString()} ₽ × {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Сервисный сбор</span>
                  <span>{serviceFee.toLocaleString()} ₽</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Итого</span>
                  <span className="text-primary">{finalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="text-sm text-gray-500">
                  <p>• Предоплата 30%: {Math.round(finalPrice * 0.3).toLocaleString()} ₽</p>
                  <p>• К доплате при заезде: {Math.round(finalPrice * 0.7).toLocaleString()} ₽</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Button */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleBooking}
              disabled={!isFormValid}
              className="flex-1 bg-primary hover:bg-primary-600"
            >
              <Icon name="CreditCard" className="w-4 h-4 mr-2" />
              Перейти к оплате
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}