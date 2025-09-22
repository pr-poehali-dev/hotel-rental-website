import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import RoomDetails from '@/components/RoomDetails';
import BookingForm from '@/components/BookingForm';
import PaymentForm from '@/components/PaymentForm';

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

const sampleRooms: Room[] = [
  {
    id: 1,
    name: 'Уютный стандарт',
    type: 'Стандартный номер',
    price: 3500,
    image: '/img/bd367f9f-5923-4469-8775-f266a80f5447.jpg',
    features: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар'],
    rating: 4.8,
    reviews: 156,
    size: 25,
    guests: 2,
    beds: 1
  },
  {
    id: 2,
    name: 'Премиум люкс',
    type: 'Люкс',
    price: 8500,
    image: '/img/312ed3a0-425a-4550-a3e5-37c1ce1db9d9.jpg',
    features: ['Wi-Fi', 'Джакузи', 'Балкон', 'Сейф', 'Халаты'],
    rating: 4.9,
    reviews: 89,
    size: 45,
    guests: 4,
    beds: 2
  },
  {
    id: 3,
    name: 'Семейный комфорт',
    type: 'Семейный номер',
    price: 5500,
    image: '/img/73eb5b79-edef-4dd4-8147-ff30b52c0765.jpg',
    features: ['Wi-Fi', 'Кухня', 'Гостиная', 'Детская кроватка'],
    rating: 4.7,
    reviews: 234,
    size: 35,
    guests: 3,
    beds: 2
  }
];

export default function Index() {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');
  const [location, setLocation] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const handleSearch = () => {
    console.log('Поиск номеров:', { checkIn, checkOut, guests, location });
    toast({
      title: "Поиск номеров",
      description: "Функция поиска будет добавлена в следующей версии",
    });
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };

  const handleBookingClick = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomDetails(false);
    setShowBookingForm(true);
  };

  const handlePayment = (data: any) => {
    setBookingData(data);
    setShowBookingForm(false);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setSelectedRoom(null);
    setBookingData(null);
    toast({
      title: "Бронирование подтверждено!",
      description: "Спасибо за выбор нашего отеля. Подтверждение отправлено на ваш email.",
    });
  };

  const closeAllModals = () => {
    setShowRoomDetails(false);
    setShowBookingForm(false);
    setShowPaymentForm(false);
    setSelectedRoom(null);
    setBookingData(null);
  };

  return (
    <div className="min-h-screen bg-hotel-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Building2" className="text-primary h-8 w-8" />
              <h1 className="text-2xl font-bold text-hotel-dark">MiniHotel</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-hotel-gray hover:text-primary transition-colors">Главная</a>
              <a href="#catalog" className="text-hotel-gray hover:text-primary transition-colors">Каталог номеров</a>
              <a href="#" className="text-hotel-gray hover:text-primary transition-colors">О нас</a>
              <a href="#" className="text-hotel-gray hover:text-primary transition-colors">Услуги</a>
              <a href="#" className="text-hotel-gray hover:text-primary transition-colors">Контакты</a>
            </nav>
            <Button className="bg-primary hover:bg-primary-600">
              <Icon name="Phone" className="w-4 h-4 mr-2" />
              Связаться
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-100 via-white to-primary-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-hotel-dark mb-4">
            Забронируйте идеальный номер
          </h2>
          <p className="text-xl text-hotel-gray mb-8 max-w-2xl mx-auto">
            Уютные номера с современными удобствами. Бесплатный Wi-Fi во всех номерах.
          </p>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto shadow-lg animate-fade-in">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-hotel-gray mb-2 block">Местоположение</label>
                  <Input
                    placeholder="Город или адрес"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-hotel-gray mb-2 block">Заезд</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, 'dd MMM', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium text-hotel-gray mb-2 block">Выезд</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, 'dd MMM', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium text-hotel-gray mb-2 block">Гости</label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 гость</SelectItem>
                      <SelectItem value="2">2 гостя</SelectItem>
                      <SelectItem value="3">3 гостя</SelectItem>
                      <SelectItem value="4">4 гостя</SelectItem>
                      <SelectItem value="5">5+ гостей</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary-600">
                    <Icon name="Search" className="w-4 h-4 mr-2" />
                    Найти номера
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Room Catalog */}
      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-hotel-dark mb-4">Наши номера</h3>
            <p className="text-hotel-gray text-lg">Выберите идеальный номер для вашего отдыха</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-scale-in cursor-pointer" onClick={() => handleRoomClick(room)}>
                <div className="relative">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-hotel-accent">
                    {room.type}
                  </Badge>
                  <div className="absolute top-4 right-4">
                    <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
                      <Icon name="Eye" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-hotel-dark">{room.name}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Icon name="Star" className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{room.rating}</span>
                        <span className="text-hotel-gray ml-1">({room.reviews} отзывов)</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{room.price.toLocaleString()} ₽</div>
                      <div className="text-sm text-hotel-gray">за ночь</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Icon name="Users" className="w-4 h-4 mr-1 text-hotel-gray" />
                        <span>{room.guests} гостя</span>
                      </div>
                      <div className="flex items-center">
                        <Icon name="Bed" className="w-4 h-4 mr-1 text-hotel-gray" />
                        <span>{room.beds} кровать</span>
                      </div>
                      <div className="flex items-center">
                        <Icon name="Square" className="w-4 h-4 mr-1 text-hotel-gray" />
                        <span>{room.size} м²</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookingClick(room);
                      }}
                      className="w-full bg-primary hover:bg-primary-600 mt-4"
                    >
                      Забронировать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-hotel-dark mb-4">Почему выбирают нас</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Wifi" className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-hotel-dark mb-2">Бесплатный Wi-Fi</h4>
              <p className="text-hotel-gray">Высокскоростной интернет во всех номерах</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-hotel-dark mb-2">24/7 Поддержка</h4>
              <p className="text-hotel-gray">Круглосуточная служба поддержки гостей</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-hotel-dark mb-2">Удобное расположение</h4>
              <p className="text-hotel-gray">В центре города рядом с достопримечательностями</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hotel-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Building2" className="text-primary h-8 w-8" />
                <h5 className="text-xl font-bold">MiniHotel</h5>
              </div>
              <p className="text-gray-300">Уютный отель для комфортного отдыха в центре города</p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Навигация</h6>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-primary">Главная</a></li>
                <li><a href="#" className="hover:text-primary">Каталог номеров</a></li>
                <li><a href="#" className="hover:text-primary">О нас</a></li>
                <li><a href="#" className="hover:text-primary">Услуги</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Контакты</h6>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Icon name="Phone" className="w-4 h-4 mr-2" />
                  +7 (800) 123-45-67
                </li>
                <li className="flex items-center">
                  <Icon name="Mail" className="w-4 h-4 mr-2" />
                  info@minihotel.ru
                </li>
                <li className="flex items-center">
                  <Icon name="MapPin" className="w-4 h-4 mr-2" />
                  г. Москва, ул. Примерная, 123
                </li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Следите за нами</h6>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-primary">
                  <Icon name="Facebook" className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-primary">
                  <Icon name="Instagram" className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-primary">
                  <Icon name="Twitter" className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 MiniHotel. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RoomDetails
        room={selectedRoom}
        isOpen={showRoomDetails}
        onClose={closeAllModals}
        onBook={handleBookingClick}
      />

      <BookingForm
        room={selectedRoom}
        isOpen={showBookingForm}
        onClose={closeAllModals}
        onPayment={handlePayment}
      />

      <PaymentForm
        bookingData={bookingData}
        isOpen={showPaymentForm}
        onClose={closeAllModals}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}