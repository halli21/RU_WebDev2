import { Contact } from './types/Contact';
import { IndividualInfo } from './types/IndividualInfo';
import { CompanyInfo } from './types/CompanyInfo';
import { ContactType } from './types/ContactType';

import data from './data/prepopulation.json';


function isIndividualInfo(contact: Contact<IndividualInfo | CompanyInfo>): contact is Contact<IndividualInfo> {
    return contact.type === 'individual';
}

function isCompanyInfo(contact: Contact<IndividualInfo | CompanyInfo>): contact is Contact<CompanyInfo> {
    return contact.type === 'company';
}


function createIndividual(contact: Contact<IndividualInfo | CompanyInfo>) {
    const div = document.createElement('div');
    div.classList.add('contact');

    let title = '';
    if (isIndividualInfo(contact)) {
        title = contact.info.title;
    } else if (isCompanyInfo(contact)) {
        title = contact.info.industry;
    }


    const generalInfo = `
        <div class="contact-thumbnail">${contact.thumbnail}</div>

        <div class="contact-heading">
            <p class="contact-name">${contact.name}</p>
            <p class="contact-small-text">${title}</p>
        </div>

        <div class="more-info" style="display: none;">
            <p class="contact-small-text">${contact.info.phoneNumber}</p>
            <p class="contact-small-text">${contact.info.email}</p>
            <p class="contact-small-text">${contact.info.address}</p>
            <p class="contact-small-text">${contact.info.website}</p>
        </div>

        <div class="icon-container">
            <span uk-icon="icon: receiver; ratio: 1.3"></span>
            <span uk-icon="icon: mail; ratio: 1.3"></span>
            <span uk-icon="icon: commenting; ratio: 1.3"></span>
            <span uk-icon="icon: calendar; ratio: 1.3"></span>
        </div>
    `;


    div.innerHTML += generalInfo;
  

    var moreInfo = div.getElementsByClassName('more-info')[0] as HTMLElement;
    if (isCompanyInfo(contact)) {
        moreInfo.innerHTML += `<p>Key Contacts</p>`;

        for (const keyContact of contact.info.keyContacts) {
            if ('name' in keyContact) { 
                moreInfo.innerHTML += `<p>${keyContact.name}</p>`;
                moreInfo.innerHTML += `<p>${keyContact.email}</p>`;
            }
        }
    }


    const button = document.createElement('button');
    button.setAttribute('uk-icon', 'icon: chevron-down; ratio: 1');
    button.onclick = function() {
       
        var moreInfo = div.getElementsByClassName('more-info')[0] as HTMLElement;
        if (moreInfo.style.display === 'none' || moreInfo.style.display === '') {
            moreInfo.style.display = 'block'; 
            button.setAttribute('uk-icon', 'icon: chevron-up; ratio: 1'); 
            div.style.height = 'auto';
            div.style.gridTemplateRows = '125px 60px auto 40px 50px';
        } else {
            moreInfo.style.display = 'none';
            button.setAttribute('uk-icon', 'icon: chevron-down; ratio: 1'); 
            div.style.gridTemplateRows = '125px 60px 40px 50px';
            div.style.height = '275px';
        }
    };

    div.appendChild(button);
    
    return div;
}




function parseAndSaveData(): void {
    const contacts: Array<Contact<IndividualInfo | CompanyInfo>> = [];

    for (const contactJSON of data.contacts) {
        const thumbnail = contactJSON.name.split(' ').map(n => n[0]).join('');

        if (contactJSON.type === ContactType.Individual) {
            const contact: Contact<IndividualInfo> = {
                name: contactJSON.name,
                thumbnail,
                type: ContactType.Individual,
                info: <IndividualInfo> {
                    phoneNumber: contactJSON.phoneNumber,
                    title: contactJSON.title,
                    email: contactJSON.email,
                    address: contactJSON.address,
                    website: contactJSON.website,
                }
            };
            contacts.push(contact);
        } else if (contactJSON.type === ContactType.Company) {
            const transformedKeyContacts: Partial<IndividualInfo>[] = contactJSON.keyContacts?.map(keyContact => ({
                name: keyContact.name,
                email: keyContact.email,
            })) || [];

            const contact: Contact<CompanyInfo> = {
                name: contactJSON.name,
                thumbnail,
                type: ContactType.Company,
                info: <CompanyInfo> {
                    phoneNumber: contactJSON.phoneNumber,
                    industry: contactJSON.industry,
                    email: contactJSON.email,
                    address: contactJSON.address,
                    website: contactJSON.website,
                    keyContacts: transformedKeyContacts
                }
            };
            contacts.push(contact);
        }
    }

    localStorage.setItem('contacts', JSON.stringify(contacts));
}



function setup() {
    const div = document.getElementById('contact-container');

    if (!localStorage.getItem('contacts')) {
        parseAndSaveData();
        console.log('storing')
    } 

    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');

    console.log(contacts);

    if (div !== null) {
        for (const contact of contacts) {
            div.appendChild(createIndividual(contact))
        }
    }
}


document.addEventListener('DOMContentLoaded', setup);