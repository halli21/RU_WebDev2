import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody
} from '@chakra-ui/react'

import {
    FormControl,
    FormLabel
} from '@chakra-ui/react'

import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'


interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
   
    return (
        <>
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
                <ModalContent>
                <ModalHeader>Register</ModalHeader>

                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Full name</FormLabel>
                        <Input placeholder='Enter full name' />
                    </FormControl>
        
                    <FormControl mt={4}>
                        <FormLabel>Username</FormLabel>
                        <Input placeholder='Enter username' />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Password</FormLabel>
                        <Input placeholder='Enter password' />
                    </FormControl>

                </ModalBody>
        
                <ModalFooter pb={20}>
                    <Button onClick={onClose} colorScheme='blue'>Cancel</Button>
                    <Button onClick={onClose}>Register</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}