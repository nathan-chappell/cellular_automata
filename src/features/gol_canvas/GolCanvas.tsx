import React, { useState, useCallback, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";

import StyledCanvasDiv from "../styled/StyledCanvasDiv";

const width = 600;
const height = 600;
const kernel: tf.Tensor4D = tf.ones([3, 3, 1, 1]);

const getNextGol: (t: Tensor) => Tensor = (t) => {
  const c = tf.tidy(() =>
    t
      .reshape([1, height, width, 1])
      .conv2d(kernel, 1, "same")
      .reshape([height, width])
  );
  const result = tf.tidy(() =>
    tf
      .onesLike(t)
      //.where(c.greaterEqual(5), t.where(c.equal(2), tf.zerosLike(t)))
      .where(
        c.equal(3).logicalOr(c.greaterEqual(7)),
        t.where(
          //c.equal(2).logicalOr(c.equal(4)).logicalOr(c.equal(5)).logicalAnd(c.lessEqual(6)),
          c.equal(2).logicalOr(c.equal(4)).logicalOr(c.equal(6)),
          //c.equal(2).logicalOr(c.equal(4)),
          tf.zerosLike(t)
        )
      )
  );
  c.dispose();
  return result;
};

// prettier-ignore
const golToImageTensor: (t: Tensor) => Tensor = (t) => tf.tidy(() => {
  const r = t.mul(200).reshape([height * width, 1]);
  const b = t.sub(1).abs().mul(100).reshape([height * width, 1]);
  const g = tf.onesLike(t).mul(30).reshape([height * width, 1]);
  const a = tf.onesLike(t).mul(256).reshape([height * width, 1]);
  return tf.stack([r, g, b, a], 1);

  //const interleaves = tf.stack([r, g, b, a], 1);
  //const array = Uint8ClampedArray.from(interleaves.dataSync());
  //console.log('[ImageData]', array);
});

const getImageData: (t: Tensor) => ImageData = (t) => {
  const data = golToImageTensor(t);
  const array = Uint8ClampedArray.from(data.dataSync());
  tf.dispose(data);
  return new ImageData(array, width, height);
};

function randomGol(ratio: number): Tensor {
  console.log("random gol");
  const t = tf
    .ones([height, width])
    .where(
      tf.randomUniform([height, width]).less(ratio),
      tf.zeros([height, width])
    );
  //console.log(t.dataSync());
  return t;
}

const initialGol = randomGol(0.3);

const GolCanvas: React.FC = () => {
  const golRef = useRef<Tensor>(initialGol);
  const goState = useRef<{ go: boolean }>({ go: true });
  const timeDeltaRef = useRef(20);
  const ratioRef = useRef(0.4);
  const framesRef = useRef<ImageBitmap[]>([]);
  const aRef = useRef<HTMLAnchorElement | null>(null);
  const [count, setCount] = useState(0);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  const paint = useCallback<() => Promise<null>>(() => {
    if (canvasRef !== null) {
      const ctx = canvasRef.getContext("2d");
      if (ctx !== null) {
        (document as any).gctx = ctx;
        ctx.clearRect(0, 0, width, height);
        ctx.strokeRect(0, 0, width, height);
        const bitmapOptions = {
          resizeWidth: width,
          resizeHeight: height,
        };
        return createImageBitmap(getImageData(golRef.current), bitmapOptions)
          .then((image: ImageBitmap) => {
            framesRef.current.push(image);
            ctx.drawImage(image, 0, 0);
          })
          .then(() => null);
      }
    }
    return Promise.resolve(null);
  }, [canvasRef]);

  const advance = useCallback(
    (once?: boolean) => {
      //console.log(count, tf.memory());
      const nextGol = getNextGol(golRef.current);
      golRef.current.dispose();
      //console.log(count, tf.memory());
      golRef.current = nextGol;
      paint().then(() => {
        if (goState.current.go && !once) {
          if (count === 50) {
            goState.current.go = false;
            setCount(0);
          } else {
            setCount(count + 1);
            //console.log("setting timeout", goState.current.go, count);
            setTimeout(() => {
              advance();
            }, timeDeltaRef.current);
          }
        }
      });
    },
    [goState, paint, golRef, count, setCount, timeDeltaRef]
  );

  const init = useCallback(() => {
    (document as any).framesRef = framesRef;
    framesRef.current = [];
    golRef.current.dispose();
    golRef.current = randomGol(ratioRef.current);
    advance(true);
  }, [framesRef, golRef, advance]);

  const onClick = useCallback(() => {
    console.log(tf.memory());
    console.log("frames:", framesRef.current.length);
    if (goState.current.go) {
      goState.current.go = false;
    } else {
      goState.current.go = true;
      advance();
    }
  }, [goState, advance]);

  const onDowload = useCallback(() => {
    const ctx = canvasRef?.getContext("2d");
    if (ctx === null || ctx === undefined) {
      return;
    } else {
      Promise.all(
        framesRef.current.map((frame: ImageBitmap) => {
          ctx.drawImage(frame, 0, 0);
          return new Promise<Blob | null>((res) => {
            ctx.canvas.toBlob((blob: Blob | null) => {
              if (blob === null) {
                console.log('null blob');
              }
              res(blob);
            });
          });
        })
      ).then((blobs: Array<Blob | null>) => {
        console.log(blobs.length);
        if (aRef.current === null) {
          return;
        } else {
          const allBlobs = blobs.filter((b) => b !== null) as Blob[];
          for (let i = 0; i < allBlobs.length; i += 1) {
            console.log(i);
            const blob = allBlobs[i];
            //const allBlobs = blobs.filter((b) => b !== null) as Blob[];
            //console.log(allBlobs.length);
            //const blob = new Blob(allBlobs);
            console.log(blob);
            const url = URL.createObjectURL(blob);
            console.log(url);
            aRef.current.download = `image_sequence.${i}.pngs`;
            aRef.current.href = url;
            aRef.current.click();
            URL.revokeObjectURL(url);
          }
        }
      });
    }
  }, [canvasRef, aRef]);

  return (
    <>
      <h2>The game of life</h2>
      <StyledCanvasDiv width={width} height={height}>
        <canvas
          ref={(ref) => setCanvasRef(ref)}
          height={height}
          width={width}
        />
      </StyledCanvasDiv>
      <form action="">
        <button onClick={onClick} type="button">
          Start/Stop
        </button>
        <button onClick={init} type="button">
          init
        </button>
        <label htmlFor="timeDelta">
          Time Delta
          <input
            type="range"
            name="timeDelta"
            min="1"
            max="300"
            onChange={(e) => {
              timeDeltaRef.current = Number(e.target.value);
            }}
          />
        </label>
        <label htmlFor="ratio">
          Ratio
          <input
            type="range"
            name="ratio"
            min="0"
            max="1"
            step=".001"
            onChange={(e) => {
              ratioRef.current = Number(e.target.value);
            }}
          />
        </label>
        <button type="button" onClick={onDowload}>
          Download Frames
          <a style={{ display: "none" }} ref={aRef} href="/">
            [hidden]
          </a>
        </button>
      </form>
    </>
  );
};

export default GolCanvas;
