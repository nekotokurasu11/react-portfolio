import React from 'react';
/** @jsxImportSource theme-ui */
import {Card, Image} from 'theme-ui';
import {documentToReactComponents, Options}
  from '@contentful/rich-text-react-renderer';
import {IProfileFields} from '../utils/@types/generated/contentful';

const options: Options = {
  renderText: (text) => {
    return text.split('\n')
        .reduce((children: any[], textSegment: string,
            index: number): any[] => {
          return [...children, index > 0 && <br key={index} />, textSegment];
        }, []);
  },
};

/**
 *
 * @param {IProfileFields} props
 * @return {jsx}
 */
const Profile: React.FC<IProfileFields> = (props: IProfileFields) => {
  return (
    <Card sx={{'width': '500px'}}>
      <div sx={{textAlign: 'center'}}>
        <h2>NAME : {props.name}</h2>
        <Image
          src={props.image.fields.file.url}
          alt={props.image.fields.title}/>
      </div>
      <h4 sx={{mb: -2}}>自己紹介文</h4>
      {documentToReactComponents(props.content, options)}
      <h4 sx={{mb: 1}}>保有資格</h4>
      {props.qualifications &&
         props.qualifications.items.map((item: string, index: number) => (
           <div key={`Qualification${index}`}>{item}</div>
         ))
      }
      <h4 sx={{mb: 1}}>触れたことのある技術</h4>
      {props.skills &&
         props.skills.items.map((item: string, index: number) => (
           <div key={`skill${index}`}>{item}</div>
         ))
      }
      <h4 sx={{mb: 1}}>このサイトについて</h4>
      React × TypeScriptで作成。
      ポートフォリオの役割を担っており、あまり細かいことは書きませんでした。<br/>
      より詳しい（雑多な）情報は以下にまとめています。<br/>
      Scrapbox : <a href='https://scrapbox.io/beeeyan-trial-box/' target='_blank' rel='noreferrer'>beeeyan-trial-box</a>
    </Card>
  );
};

export default Profile;