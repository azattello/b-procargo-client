import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/main.css';
import { getSettings, getContacts } from '../action/settings';
import { getFilials } from '../action/filial';
// import filials from '../assets/icons/filials.svg';
import filial from '../assets/icons/filials.svg'
import guide from '../assets/icons/help-circle-outline.svg';
import geo from '../assets/icons/map-outline.svg';
// import handshake from '../assets/icons/people-circle-outline.svg';
import whatsapp from '../assets/icons/whatsapp.svg'
import news2 from '../assets/icons/community.svg'
// import news2 from '../assets/icons/marketing.png';
import logo from '../assets/img/logo2.jpg';

import Tab from './Tab';
import config from '../config';

import './styles/tab.css';
import house from '../assets/icons/home-outline.svg';
import house2 from '../assets/icons/home.svg';

import box from '../assets/icons/layers-outline.svg';
import box2 from '../assets/icons/layers.svg';

import user from '../assets/icons/person-circle-outline.svg';
import user2 from '../assets/icons/person-circle.svg';

import phoneIcon from '../assets/icons/call-outline.svg';
import whatsappIcon from '../assets/icons/logo-whatsapp.svg';
import instagramIcon from '../assets/icons/logo-instagram.svg';
// import telegramIcon from '../assets/icons/telegram.png';
import axios from 'axios';

import { useTranslation } from 'react-i18next';
import '../i18n';


const Main = () => {
    const location = useLocation();
    const contactsRef = useRef(null);
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    
    const [settings, setSettings] = useState([]);
    const [showAdress, setShowAdress] = useState(false); // Для управления видимостью всплывающего окна
    const [showFilials, setShowFilials] = useState(false); // Для управления видимостью всплывающего окна
    const [userData, setUserData] = useState(null);

    const [banners, setBanners] = useState([null, null, null]); // Массив для хранения баннеров

    const [filials, setFilials] = useState([]); // Состояние для списка филиалов
    const [contacts, setContacts] = useState([]); // Состояние для списка филиалов
    
    const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
    const [isProhibitedItemsOpen, setIsProhibitedItemsOpen] = useState(false);
    const [isDeliveryTimeOpen, setIsDeliveryTimeOpen] = useState(false);
    const [isCargoResponsibilityOpen, setIsCargoResponsibilityOpen] = useState(false);

    const [copySuccess, setCopySuccess] = useState("");
    // const [rate, setRate] = useState(null);
    // const [error, setError] = useState(null);

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    };
  

    const toggleAboutUs = () => setIsAboutUsOpen(!isAboutUsOpen);
    const toggleProhibitedItems = () => setIsProhibitedItemsOpen(!isProhibitedItemsOpen);
    const toggleDeliveryTime = () => setIsDeliveryTimeOpen(!isDeliveryTimeOpen);
    const toggleCargoResponsibility = () => setIsCargoResponsibilityOpen(!isCargoResponsibilityOpen);
    
    const fetchSettings = async () => {
        const allSettings = await getSettings();
        setSettings(allSettings || {}); 
    };
    
    const handleCopy = () => {
        const addressText = `承承花CHENGH
18057977986   
浙江省金华市义乌市物华路39号哈萨克物流公司 入库号：(承承花CHENGH)  ${userData.phone})\n${userData.name}`
        
        navigator.clipboard.writeText(addressText).then(
          () => {
            setCopySuccess("Адрес скопирован!");
            setTimeout(() => setCopySuccess(""), 2000); // Убираем сообщение через 2 секунды
          },
          (err) => {
            console.error("Не удалось скопировать текст: ", err);
            setCopySuccess("Ошибка копирования");
          }
        );
      };


     // Функция для получения данных о филиалах при загрузке компонента
     useEffect(() => {

      
        fetchFilials(); // Вызываем функцию получения данных о филиалах при загрузке компонента


        // const fetchExchangeRate = async () => {
        //     try {
        //         const response = await axios.get(`${config.apiUrl}/api/settings/exchange-rate`);
        //         setRate(response.data.rate); // Устанавливаем курс
        //     } catch (err) {
        //         console.error('Ошибка при получении курса:', err);
        //         setError('Не удалось загрузить курс валют.');
        //     }
        // };

        // fetchExchangeRate();

      }, []);


      const fetchFilials = async () => {
        // Вызываем функцию getFilials для получения данных о всех филиалах
        const allFilials = await getFilials();
        const allContacts = await getContacts();
        setFilials(allFilials); // Обновляем список филиалов
        setContacts(allContacts);
      };


      

    useEffect(() => {
        fetchSettings();
        

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                } else {
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        };

        fetchUserProfile();
        
    }, []);

    const toggleAdress = () => {
        setShowAdress(!showAdress);
    };

    const toggleFilials = () => {
        setShowFilials(!showFilials);
       
    };


    // Функция для получения существующих баннеров с сервера
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/api/upload/getBanners`);
                const bannerPaths = response.data.banners;

                // Обновляем массив баннеров с путями из базы данных
                if (bannerPaths && bannerPaths.length > 0) {
                    const updatedBanners = [...bannerPaths]; // Сохраняем полученные баннеры
                    // Если меньше трех баннеров, дополняем пустыми элементами для отображения кнопок
                    while (updatedBanners.length < 3) {
                        updatedBanners.push(null);
                    }
                    setBanners(updatedBanners);
                }
            } catch (error) {
                console.error("Ошибка при получении баннеров:", error);
            }
        };

        fetchBanners(); // Вызываем функцию при загрузке компонента
    }, []);



    const scrollToContacts = () => {
        contactsRef.current.scrollIntoView({ behavior: "smooth" });
    };



    return (
        <div className="main">
            <header className="header header-main">
                <div className="LogoHeader">
                    <div className='logo-title'>
                        <img src={logo} className="logo2" alt="" />
                        <div className="title2">Gold Cargo</div>
                    </div>
                
                    <div className="lang">
                        <button onClick={() => changeLanguage('kz')}>KZ</button>
                        <button onClick={() => changeLanguage('ru')}>RU</button>
                    </div>
                </div>

                <ul className="Menu">
                    <Link to="/main" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/main' ? house2 : house} alt="" />
                        <p style={location.pathname === '/main' ? { color: '#1F800C' } : { color: '#808080' }}>{t('home.title')}</p>
                    </Link>

                    <Link to="/parcels" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/parcels' ? box2 : box} alt="" />
                        <p style={location.pathname === '/parcels' ? { color: '#1F800C' } : { color: '#808080' }}>{t('menu.parcels')}</p>
                    </Link>

                    <Link to="/profile" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/profile' ? user2 : user} alt="" />
                        <p style={location.pathname === '/profile' ? { color: '#1F800C' } : { color: '#808080' }}>Профиль</p>
                    </Link>

                    {userData && (userData.role === 'admin' || userData.role === 'filial') && (
                        <Link to="/dashboard" className="tabbutton-menu">{t('menu.dashboard')}</Link>
                    )}
                </ul>


            </header>
        
            {banners.filter(Boolean).length > 0 && (
                <div className="banners_client">
                    {banners.filter(Boolean).map((banner, index) => (
                        <div className="banner_client" key={index}>
                            <img src={`${config.apiUrl}${banner}`} alt={`banner-${index}`} />
                        </div>
                    ))}
                </div>
            )}




            <div className="section">

                <div className="blocks__info">
                    <a href={settings.videoLink || '#'} target="_blank" rel="noreferrer" className="block_info">
                        <h3 className="text__block_info">{t('menu.instruction')}</h3>
                        <img className="iconMain" src={guide} alt="" />
                    </a>

                    <div className="block_info" onClick={toggleFilials}>
                        <h3 className="text__block_info">{t('menu.branches')}</h3>
                        <img className="iconMain" src={filial} alt="" />
                    </div>

                    <div className="block_info" onClick={toggleAdress}>
                        <h3 className="text__block_info">{t('menu.warehouseAddress')}</h3>
                        <img className="iconMain" src={geo} alt="" />
                    </div>

                    <a href={settings.whatsappNumber || '#'} target="_blank" rel="noreferrer" className="block_info">
                        <h3 className="text__block_info">WhatsApp</h3>
                        <img className="iconMain" src={whatsapp} alt="" />
                    </a>


                    <a onClick={scrollToContacts} className="block_info" href="#contacts">
                        <h3 className="text__block_info">{t('menu.contacts')}</h3>
                        <img className="iconMain" src={news2} alt="" />
                    </a>

                    
                    {/* <div className="block_info">
                            {error ? (
                                <p style={{ color: 'red' }}>{error}</p>
                            ) : rate ? (
                                <p>1$ = {Math.round(rate)}₸</p>
                            ) : (
                                <p>Загрузка...</p>
                            )}
                    </div> */}

                </div>

              

                {showAdress && (
                    <div className="about">
                        <h3>{t('menu.warehouseAddress')}</h3>
                            <p className="chinaAddress">
                            ВТ-ARYS 
                            18757878485 
                            浙江省金华市义乌市 
                            后宅街道杜元小区33栋7单元一楼兔喜仓库( BT ARYS) {userData.name} {userData.phone} 
                            </p>
                            <button onClick={handleCopy} className="copyButton">{t('menu.copy')}</button>
                            {copySuccess && <span className="copyMessage">{copySuccess}</span>}
                    </div>
                )}


                {showFilials && (
                    <div className="about">
                        <h3>{t('menu.branches')}</h3>
                         <p>
                         {filials.map((filial) => (
                            <div className="filial-el filial-el-client" key={filial.filial._id}>
                                    <p><b>{'- ' + filial.filial.filialText}</b>  Адрес: {filial.filial.filialAddress}</p>
                            </div>

                            ))}
                        </p>
                    </div>
                )}



                <div className="abouts_container">
                    <div className="about" onClick={toggleAboutUs}>
                        <div className="toggle_header">
                        <h3>{t('menu.aboutUs')}</h3>
                        <span className={`arrow ${isAboutUsOpen ? "open" : ""}`}>▼</span>
                        </div>
                        {isAboutUsOpen && <p>{settings.aboutUsText}</p>}
                    </div>

                    <div className="about" onClick={toggleProhibitedItems}>
                        <div className="toggle_header">
                        <h3>{t('menu.prohibitedItems')}</h3>
                        <span className={`arrow ${isProhibitedItemsOpen ? "open" : ""}`}>▼</span>
                        </div>
                        {isProhibitedItemsOpen && <p>{settings.prohibitedItemsText}</p>}
                    </div>

                    <div className="about" onClick={toggleDeliveryTime}>
                        <div className="toggle_header">
                        <h3>{t('menu.deliveryTime')}</h3>
                        <span className={`arrow ${isDeliveryTimeOpen ? "open" : ""}`}>▼</span>
                        </div>
                        {isDeliveryTimeOpen && <p>{settings.deliveryTime}</p>}
                    </div>

                    <div className="about" onClick={toggleCargoResponsibility}>
                        <div className="toggle_header">
                        <h3>{t('menu.cargoResponsibility')}</h3>
                        <span className={`arrow ${isCargoResponsibilityOpen ? "open" : ""}`}>▼</span>
                        </div>
                        {isCargoResponsibilityOpen && <p>{settings.cargoResponsibility}</p>}
                    </div>

                    
                    <div className="about contacts" id='contacts' ref={contactsRef} >
                        <h3>{t('menu.contacts')}</h3>
                        <div className="contacts__el_main">
                            <img src={phoneIcon} alt="" />
                            <a target="_blank" rel="noreferrer" href={`tel:${contacts.phone}`}>{contacts.phone ? `${contacts.phone}` : ''}</a>
                        </div>
                        <div className="contacts__el_main">
                            <img src={whatsappIcon} alt="" />
                            <a target="_blank" rel="noreferrer" href={contacts.whatsappLink}>{contacts.whatsappPhone ? `${contacts.whatsappPhone}` : ''}</a>
                        </div>
                        <div className="contacts__el_main">
                            <img src={instagramIcon} alt="" />
                            <a target="_blank" rel="noreferrer" href={`https://www.instagram.com/${contacts.instagram}`}>{contacts.instagram ? `${contacts.instagram}` : ''}</a>

                        </div>
                        {/* <div className="contacts__el_main">
                            <img src={telegramIcon} alt="" />
                            <a target="_blank" rel="noreferrer" href={contacts.telegramLink}>{contacts.telegramId ? `${contacts.telegramId}` : ''}</a>

                        </div> */}
                    </div>

                </div>




            <div className="area"></div>

            </div>
            <Tab />

        </div>
    );
};

export default Main;
