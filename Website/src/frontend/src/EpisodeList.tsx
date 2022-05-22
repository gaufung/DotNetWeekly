import React from 'react';
import { Episode } from './EpisodeData';
import { getEpisodes } from './EpisodeData';
import {
    Separator,
    Stack,
    IStackTokens,
    DocumentCard,
    IDocumentCardStyles,
    DocumentCardImage,
    ImageFit,
    DocumentCardDetails,
    DocumentCardTitle,
} from '@fluentui/react';
import md, { Image } from 'markdown-ast';

const column: number = 3;

const stackTokens: IStackTokens = {
    childrenGap: 12,
};

const cardStyles: IDocumentCardStyles = {
    root: {
        display: 'inline-block',
        marginRight: 20,
        marginBottom: 20,
        width: 320,
    },
};

export interface EpisodeListState {
    episodes: Episode[][];
}

export class EpisodeList extends React.Component<any, EpisodeListState> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor

    // eslint-disable-next-line no-empty-pattern
    constructor(any: {}) {
        super(any);
        this.state = {
            episodes: [],
        };
    }

    async componentDidMount(): Promise<void> {
        try {
            const episodes = await getEpisodes();
            const episodesGroup: Episode[][] = [];
            episodes.sort((a, b) => {
                if (a.createTime < b.createTime) {
                    return 1;
                }
                return -1;
            });
            for (let i = 0; i < episodes.length; ) {
                const row: Episode[] = [];
                for (let j = 0; j < column && i < episodes.length; j++) {
                    row.push(episodes[i]);
                    i++;
                }
                episodesGroup.push(row);
            }
            this.setState({
                episodes: episodesGroup,
            });
        } catch (error) {}
    }

    retrieveImgeSource(episode: Episode): string {
        const astNodes = md(episode.content);
        const imageNode = astNodes.find((p) => p.type === 'image');
        if (!!imageNode) {
            const node = imageNode as Image;
            return node.url;
        }
        return '';
    }

    render(): JSX.Element {
        return (
            <Stack
                styles={{
                    root: {
                        height: '100px',
                    },
                }}
            >
                {
                    // eslint-disable-next-line array-callback-return
                    this.state.episodes.map((episodes) => (
                        <>
                            <Separator />
                            <Stack
                                horizontal
                                horizontalAlign="center"
                                tokens={stackTokens}
                            >
                                {
                                    // eslint-disable-next-line array-callback-return
                                    episodes.map((episode) => (
                                        <DocumentCard
                                            styles={cardStyles}
                                            onClickHref={`/episode/${episode.id}`}
                                        >
                                            <DocumentCardImage
                                                height={120}
                                                imageFit={
                                                    ImageFit.centerContain
                                                }
                                                imageSrc={this.retrieveImgeSource(
                                                    episode,
                                                )}
                                            />
                                            <DocumentCardDetails>
                                                <DocumentCardTitle
                                                    title={episode.title}
                                                    shouldTruncate
                                                ></DocumentCardTitle>
                                            </DocumentCardDetails>
                                        </DocumentCard>
                                    ))
                                }
                            </Stack>
                        </>
                    ))
                }
            </Stack>
        );
    }
}
