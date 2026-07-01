import Title from '@/components/Typography/Title/title';
import React from 'react'
import { TbFile } from 'react-icons/tb';
import styles from '@/styles/lib/ui/no-data.module.scss'
import Text from '@/components/Typography/Text/text';
import Paragraph from '@/components/Typography/Paragraph/paragraph';

interface Props {
    text: string
}

export default function NoData({text}: Props) {
  return (
    <div className={styles.container}>
        {/* <TbFile size={120} /> */}
       <div className={styles.second_layer}>
         <Text size="lg">There are currently no {text} available yet!</Text>
            <Paragraph>Start by creating a new educational resource to make it available.</Paragraph>
       </div>
    </div>
  )
}
